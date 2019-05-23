const axios = require('axios');

class Auth {
  constructor() {
    this.getAPIToken().then(token => {
      this.token = token;

      this.handshake = axios.create({
        baseURL: process.env.AUTH0_TOKEN_AUDIENCE,
        headers: {
          authorization: `Bearer ${token}`
        }
      });
    });
  }

  async getUser(id) {
    try {
      const result = await this.handshake.get(`users/${id}`);
      return result.data;
    } catch (error) {
      console.error(error);
    }
  }

  async patchUser(id, changes) {
    try {
      const result = await this.handshake.patch(`users/${id}`, changes);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  getAPIToken() {
    return new Promise(async (res, rej) => {
      try {
        const form = {
          grant_type: 'client_credentials',
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          audience: process.env.AUTH0_TOKEN_AUDIENCE
        };

        const result = await axios.post(process.env.AUTH0_TOKEN_URL, form);

        res(result.data.access_token);
      } catch (error) {
        rej(error);
      }
    });
  }
}

const auth = new Auth();

module.exports = auth;
