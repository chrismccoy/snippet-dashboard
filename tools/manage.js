#!/usr/bin/env node

/**
 * This script allows listing, deleting, and creating new snippets
 *
 * Usage:
 *   node manage.js <command> [arguments]
 *
 * Commands:
 *   list                                List all snippets in the database.
 *   delete <snippetId>                  Delete a snippet by its ID. Prompts for confirmation.
 *   create <filePath> [options]         Create a new snippet from a local file.
 *                                       See 'create --help' for options.
 *
 * Global Options:
 *   --help                              Display this help message.
 */

const fs = require("fs").promises;
const path = require("path");
const readline = require('readline');

const { initializeDatabase, getDb } = require('../config/database');
const query = require('../lib/query-handler');

const snippetService = require('../services/snippet.service');
const categoryService = require('../services/category.service');
const languageService = require('../services/language.service');
const userService = require('../services/user.service');

/**
 * Prompts the user for confirmation via the command line.
 */
function confirmPrompt(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(question + ' (y/N): ', answer => {
            rl.close();
            resolve(answer.toLowerCase() === 'y');
        });
    });
}

/**
 * Helper function to format an array of objects into a clean, text-based table
 */
function formatCliTable(data, headers, columnMap) {
    if (!data || data.length === 0) {
        return 'No data.';
    }

    const columns = headers.map(header => ({
        key: columnMap[header] || header,
        title: header,
        maxWidth: header.length
    }));

    data.forEach(row => {
        columns.forEach(col => {
            const value = row[col.key] !== null && row[col.key] !== undefined ? String(row[col.key]) : 'N/A';
            col.maxWidth = Math.max(col.maxWidth, value.length);
        });
    });

    let tableOutput = '';
    const separatorChar = '-';
    const padding = 1;

    const createSeparator = () => {
        return '+' + columns.map(col => separatorChar.repeat(col.maxWidth + (padding * 2))).join('+') + '+\n';
    };

    const createRow = (rowData, isHeader = false) => {
        const rowString = '|' + columns.map(col => {
            let value = '';
            if (isHeader) {
                value = col.title;
            } else {
                value = rowData[col.key] !== null && rowData[col.key] !== undefined ? String(rowData[col.key]) : 'N/A';
            }
            return ' '.repeat(padding) + value.padEnd(col.maxWidth) + ' '.repeat(padding);
        }).join('|') + '|\n';
        return rowString;
    };

    tableOutput += createSeparator();
    tableOutput += createRow(headers.reduce((acc, header) => { acc[columnMap[header] || header] = header; return acc; }, {}), true);
    tableOutput += createSeparator();

    data.forEach(row => {
        tableOutput += createRow(row);
    });

    tableOutput += createSeparator();

    return tableOutput;
}

/**
 * Produces a human-readable snippet title from a given filename.
 */
function inferTitleFromFilename(filename) {
    const nameWithoutExt = path.basename(filename, path.extname(filename));
    return nameWithoutExt.split(/[-_]/)
                         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                         .join(' ');
}

/**
 * Action for the 'list' command.
 */
async function listSnippetsAction() {
    await initializeDbForCli();

    const sql = `
        SELECT
            s.id, s.title, s.slug,
            c.name as category,
            l.name as language,
            u.username as author,
            s.created_at, s.is_private
        FROM snippets s
        LEFT JOIN categories c ON s.category_id = c.id
        LEFT JOIN languages l ON s.language_id = l.id
        LEFT JOIN users u ON s.user_id = u.id
        ORDER BY s.created_at DESC
    `;
    const snippets = await query.all(sql);

    if (snippets.length === 0) {
        console.log('\nNo snippets found in the database.');
        return;
    }

    const tableHeaders = ['ID', 'Title', 'Author', 'Category', 'Language', 'Private', 'Created At'];

    const columnMap = {
        'ID': 'id',
        'Title': 'title',
        'Author': 'author',
        'Category': 'category',
        'Language': 'language',
        'Private': 'is_private',
        'Created At': 'created_at'
    };

    const formattedSnippets = snippets.map(s => ({
        id: s.id,
        title: s.title,
        author: s.author || 'N/A',
        category: s.category || 'N/A',
        language: s.language || 'N/A',
        is_private: s.is_private ? 'Yes' : 'No',
        created_at: new Date(s.created_at).toLocaleDateString()
    }));

    console.log('\n--- All Snippets (Admin View) ---\n');
    console.log(formatCliTable(formattedSnippets, tableHeaders, columnMap));
    console.log('\n');
}

/**
 * Action for the 'delete' command.
 */
async function deleteSnippetAction(snippetId) {
    await initializeDbForCli();

    // Fetch snippet details to confirm with the user before deletion
    const snippet = await query.get("SELECT s.id, s.title, u.username FROM snippets s JOIN users u ON s.user_id = u.id WHERE s.id = ?", [snippetId]);

    if (!snippet) {
        console.log(`\nSnippet with ID ${snippetId} not found.`);
        return;
    }

    console.log(`\nFound snippet: "${snippet.title}" (ID: ${snippet.id}) by ${snippet.username}.`);
    const confirmed = await confirmPrompt('Are you absolutely sure you want to delete this snippet?');

    if (!confirmed) {
        console.log('Deletion cancelled.');
        return;
    }

    const result = await query.run("DELETE FROM snippets WHERE id = ?", [snippetId]);

    if (result.changes > 0) {
        console.log(`\n✅ Snippet "${snippet.title}" (ID: ${snippet.id}) successfully deleted.`);
    } else {
        console.log(`\n❌ Failed to delete snippet with ID ${snippetId}.`);
    }
}

/**
 * Action for the 'create' command.
 */
async function createSnippetAction(filePath, options) {
    try {
        // Validate and read the snippet code file.
        try {
            await fs.access(filePath, fs.constants.R_OK);
        } catch (error) {
            throw new Error(
                `File system error: Could not read file '${filePath}'. ` +
                `Please ensure the path is correct and the file is readable. ${error.message}`
            );
        }
        console.log(`⏳ Reading snippet code from '${filePath}'...`);
        const code = await fs.readFile(filePath, "utf-8");

        // Determine snippet title.
        const inferredTitle = options.title || inferTitleFromFilename(filePath);
        if (!inferredTitle) {
            throw new Error(
                "Snippet title is required. Please provide it via --title or ensure the filename can produce one."
            );
        }

        await initializeDbForCli();

        // Look up Category and Language IDs
        let categoryId = null;

        if (options.category) {
            const category = await categoryService.findByName(options.category);
            if (category) {
                categoryId = category.id;
                console.log(`🔎 Found Category: "${category.name}" (ID: ${categoryId})`);
            } else {
                console.warn(`⚠️ Warning: Category "${options.category}" not found. Snippet will be created without a specific category.`);
            }
        }

        let languageId = null;
        if (options.language) {
            const language = await languageService.findByName(options.language);
            if (language) {
                languageId = language.id;
                console.log(`🔎 Found Language: "${language.name}" (ID: ${languageId})`);
            } else {
                console.warn(`⚠️ Warning: Language "${options.language}" not found. Snippet will be created without a specific language.`);
            }
        }

        // For CLI creation, snippets are assigned to the initial admin user.
        const adminUsername = process.env.ADMIN_USERNAME;

        if (!adminUsername) {
            throw new Error("ADMIN_USERNAME not set in .env. CLI-created snippets must have an owner.");
        }

        const adminUser = await userService.findByUsername(adminUsername);

        if (!adminUser) {
            throw new Error(`Admin user '${adminUsername}' not found in DB. Please ensure the initial admin account has been created by running the web server once.`);
        }
        const userId = adminUser.id;

        // Prepare snippet data object for the service.
        const snippetData = {
            title: inferredTitle,
            description: options.description || `Created via CLI from file: ${path.basename(filePath)}`,
            code: code,
            tags: options.tags || null,
            category_id: categoryId,
            language_id: languageId,
            reference_url: options.ref || null,
            is_private: options.private ? 1 : 0,
            user_id: userId,
        };

        // Call the snippet service to create the entry in the database.
        console.log(`🚀 Creating snippet with title: '${snippetData.title}'...`);
        const newSnippet = await snippetService.create(snippetData);

        console.log("✅ Snippet created successfully!");
        console.log(`Response: { snippetId: ${newSnippet.lastID} }`);
        console.log(`🌐 View it in your dashboard: http://localhost:3000/admin/snippets`);

    } catch (error) {
        console.error(`❌ An error occurred: ${error.message}`);
        throw error;
    }
}

/**
 * Initialize the database silently for CLI operations.
 */
let dbInitialized = false; // Flag to prevent multiple initializations

async function initializeDbForCli() {
    if (dbInitialized) return;

    try {
        await initializeDatabase(true);
        await new Promise(resolve => setTimeout(resolve, 50));
        getDb();
        dbInitialized = true;
        console.log("Database initialized for direct access commands.");
    } catch (dbError) {
        console.error("\nFATAL: Could not initialize database for CLI direct access.");
        console.error(dbError.message);
        process.exit(1);
    }
}

/**
 * Parses command-line arguments
 */
async function woot() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args[0] === '--help') {
        console.log(`
Usage: node manage.js <command> [arguments]

Commands:
  list                                List all snippets in the database (direct DB access).
  delete <snippetId>                  Delete a snippet by its ID (direct DB access). Prompts for confirmation.
  create <filePath> [options]         Create a new snippet from a file (direct DB access).
                                      See 'create --help' for options.

Example:
  node manage.js list
  node manage.js delete 123
  node manage.js create ./my_code.js --title "My CLI Snippet" --language "JavaScript"

Global Options:
  --help                            Display this help message.
        `);
        return;
    }

    const command = args[0].toLowerCase();
    const commandArgs = args.slice(1);

    switch (command) {
        case 'list':
            await listSnippetsAction();
            break;

        case 'delete':
            const snippetId = parseInt(commandArgs[0], 10);
            if (isNaN(snippetId) || snippetId <= 0) {
                console.error('\nError: For "delete" command, please provide a valid snippet ID.');
                console.error('Usage: node manage.js delete <snippetId>');
                process.exit(1);
            }
            await deleteSnippetAction(snippetId);
            break;

        case 'create':
            const filePath = commandArgs[0];
            const options = {};
            
            // Manual parsing of options for the 'create' command.
            for (let i = 1; i < commandArgs.length; i++) {
                const arg = commandArgs[i];
                if (arg === '--help') {
                    console.log(`
Usage: node manage.js create <filePath> [options]

Description: Create a new snippet from a local file.

Arguments:
  <filePath>                  Path to the local file containing the snippet code.

Options:
  -t, --title <title>         Snippet title (required if not produced from filename)
  -d, --description <desc>    Snippet description
  -c, --category <name>       Category name (e.g., "Web Dev")
  -l, --language <name>       Language name (e.g., "JavaScript")
  --tags <tags>               Comma-separated tags (e.g., "cli, script")
  -r, --ref <url>             Reference URL
  -p, --private               Mark the snippet as private (default is public)
  --help                      Display help for the 'create' command.
                    `);
                    process.exit(0);
                } else if (arg.startsWith('-')) {
                    let optionName = arg.startsWith('--') ? arg.slice(2) : arg.slice(1);
                    if (optionName === 't') optionName = 'title';
                    if (optionName === 'd') optionName = 'description';
                    if (optionName === 'c') optionName = 'category';
                    if (optionName === 'l') optionName = 'language';
                    if (optionName === 'r') optionName = 'ref';
                    if (optionName === 'p') optionName = 'private';

                    if (optionName === 'private') {
                        options.private = true;
                    } else {
                        const value = commandArgs[i + 1];
                        if (value === undefined || value.startsWith('-')) {
                            console.error(`Error: Option --${optionName} requires a value.`);
                            process.exit(1);
                        }
                        options[optionName] = value;
                        i++;
                    }
                } else {
                    console.error(`Error: Unexpected argument "${arg}". Expected options after file path.`);
                    process.exit(1);
                }
            }

            if (!filePath) {
                console.error('\nError: For "create" command, please provide a file path.');
                console.error('Usage: node manage.js create <filePath> [options]');
                process.exit(1);
            }
            await createSnippetAction(filePath, options);
            break;

        default:
            console.error(`\nError: Unknown command "${command}".`);
            console.error('Run with --help for usage information.');
            process.exit(1);
    }
}

// woot
woot().catch(error => {
    process.exit(1);
});
