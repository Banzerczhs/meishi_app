const md5 = require('md5');
const moment = require('moment');

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    return queryInterface.bulkInsert('users', [
      {
        id: 1,
        username: 'mt',
        password: md5('123456'),
        disable: false,
        phone: '13000000000',
        email: 'mt@meishi.com',
        created_ip_at: '127.0.0.1',
        updated_ip_at: '127.0.0.1',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: 2,
        username: 'zmouse',
        password: md5('123456'),
        disable: false,
        phone: '13000000001',
        email: 'zmouse@meishi.com',
        created_ip_at: '127.0.0.1',
        updated_ip_at: '127.0.0.1',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: 3,
        username: 'reci',
        password: md5('123456'),
        disable: false,
        phone: '13000000002',
        email: 'reci@meishi.com',
        created_ip_at: '127.0.0.1',
        updated_ip_at: '127.0.0.1',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      {
        id: 4,
        username: 'kimoo',
        password: md5('123456'),
        disable: false,
        phone: '13000000003',
        email: 'kimoo@meishi.com',
        created_ip_at: '127.0.0.1',
        updated_ip_at: '127.0.0.1',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('users', null, {});
  }
};
