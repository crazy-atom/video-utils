const sqlite3 = require('sqlite3').verbose();

const logger = require('../utils/logger');

class VideoModel {
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
      CREATE TABLE IF NOT EXISTS videos (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        originalName TEXT NOT NULL,
        path TEXT NOT NULL,
        size INTEGER,
        parentId TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(query, (err) => {
      if (err) {
        logger.error('Table creation error', { error: err });
      }
    });
  }

  createVideo(videoData) {
    return new Promise((resolve, reject) => {
      const {
        id,
        filename,
        originalName,
        path: filePath,
        size = 0,
        parentId = null,
      } = videoData;

      const query = `
        INSERT INTO videos
        (id, filename, originalName, path, size, parentId)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      this.db.run(
        query,
        [id, filename, originalName, filePath, size, parentId],
        (err) => {
          if (err) {
            logger.error('Video insertion error', { error: err });
            return reject(err);
          }
          return resolve(id);
        },
      );
    });
  }

  getVideoById(videoId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM videos WHERE id = ?';
      this.db.get(query, [videoId], (err, row) => {
        if (err) {
          logger.error('Video retrieval error', { error: err });
          return reject(err);
        }
        return resolve(row);
      });
    });
  }

  listVideos() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM videos ORDER BY createdAt DESC';
      this.db.all(query, (err, rows) => {
        if (err) {
          logger.error('Videos listing error', { error: err });
          return reject(err);
        }
        return resolve(rows);
      });
    });
  }
}

module.exports = new VideoModel();
