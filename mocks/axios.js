export const axios = {
  base_url: '',

  sent: {},
  replies: {},
};

function BadRequest(statusText) {
  this.response = {
    status: 400,
    statusText,
  };
}

const verb = (path, data) => {
  return new Promise(resolve => {
    const reply = axios.replies[path.replace(axios.base_url, '')];

    switch (reply.code) {
      case 400: {
        throw new BadRequest(reply.data);
      }
    }

    if (data) {
      axios.sent[path] = data;
    }
    resolve(reply);
  });
};

const listener = path => {
  return {
    reply: (code, data) => {
      const reply = {
        code,
      };

      if (data) {
        reply.data = data;
      }

      axios.replies[path] = reply;
      return axios;
    },
  };
};

axios.get = jest.fn(verb);
axios.post = jest.fn(verb);

axios.onGet = listener;
axios.onPost = listener;

const exportable = {
  get: jest.fn(verb),
  post: jest.fn(verb),
};

export default {
  create: () => exportable,
  ...exportable,
};
