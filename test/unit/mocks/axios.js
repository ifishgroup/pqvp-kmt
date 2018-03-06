module.exports = {
  getfeatured: jest.fn(() =>
    Promise.resolve({ _id: '5a9703c391ae503de4b0b2b5', title: 'Axios Mock Featured Article' }),
  ),
  gettop: jest.fn(() =>
    Promise.resolve({
      _id: '5a97288dff873843688ee775',
      title: 'Top Article Number 1',
      viewcount: 12,
    }),
  ),
};
