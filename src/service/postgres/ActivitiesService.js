const { nanoid } = require('nanoid');
const { Pool } = require('pg');

class ActivitiesServices {
  constructor() {
    this.pool = new Pool();
  }

  async addActivities(action, { playlistId, songId, userId }) {
    const id = `PSactivities-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: `INSERT INTO activities VALUES($1, $2, $3, $4, $5, $6)`,
      values: [id, playlistId, songId, userId, action, time],
    };

    await this.pool.query(query);
  }

  async getActivities(id) {
    const query = {
      text: `
        SELECT
          u.username,
          s.title,
          a.action,
          a.time
        FROM
          activities a
        JOIN
          songs s ON a.song_id = s.id
        JOIN
          users u ON a.user_id = u.id
        WHERE
          a.playlist_id = $1;
      `,
      values: [id],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }
}

module.exports = ActivitiesServices;
