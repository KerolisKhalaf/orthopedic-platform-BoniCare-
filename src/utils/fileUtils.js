import fs from 'fs/promises';
import logger from './logger.js';

/**
 * Safely deletes a file at the specified path asynchronously.
 * Suppresses file-not-found (ENOENT) errors, and logs other errors.
 * 
 * @param {string} filePath - Absolute path to the file to be deleted.
 */
export const safeUnlink = async (filePath) => {
    if (!filePath) return;
    try {
        await fs.unlink(filePath);
        logger.debug('Temporary file deleted successfully', { filePath });
    } catch (error) {
        if (error.code !== 'ENOENT') {
            logger.error('Failed to delete temporary file', { filePath, error });
        }
    }
};
