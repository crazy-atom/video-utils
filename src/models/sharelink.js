const sqlite3 = require('sqlite3').verbose();
const logger = require('../utils/logger');

class LinkModel {
  constructor() {
    const dbPath = process.env.DATABASE_PATH;
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        logger.error('Database connection error', { error: err });
        throw err;
      }
      this.initializeTable();
    });
  }

  initializeTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS video_links (
        id TEXT PRIMARY KEY,
        videoId TEXT NOT NULL,
        token TEXT NOT NULL,
        expiresAt DATETIME NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(query, (err) => {
      if (err) {
        logger.error('Link table creation error', { error: err });
      }
    });
  }

  createLink(linkData) {
    return new Promise((resolve, reject) => {
      const {
        id,
        videoId,
        token,
        expiresAt,
      } = linkData;

      const query = `
        INSERT INTO video_links
        (id, videoId, token, expiresAt)
        VALUES (?, ?, ?, ?)
      `;

      this.db.run(
        query,
        [id, videoId, token, expiresAt],
        (err) => {
          if (err) {
            logger.error('Link insertion error', { error: err });
            return reject(err);
          }
          return resolve(id);
        },
      );
    });
  }

  getLinkByToken(token) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM video_links
        WHERE token = ? AND expiresAt > datetime('now', 'utc')
      `;

      this.db.get(query, [token], (err, row) => {
        if (err) {
          logger.error('Link retrieval error', { error: err });
          return reject(err);
        }
        return resolve(row);
      });
    });
  }

  clearAllLinks() {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM video_links';
      this.db.run(query, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = new LinkModel();
