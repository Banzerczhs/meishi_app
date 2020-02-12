# Database create
### 数据库名：meishi_develpoment

- user 表

|    字段名    |     类型     |  默认值  | 索引类型 |     描述     | auto_increment |
| :----------: | :----------: | :------: | :------: | :----------: | :------------: |
|      id      | integer(10)  | not null | primary  |    用户ID    |      true      |
|   username   | varchar(255) | not null |  unique  |    用户名    |     false      |
|   password   | varchar(255) | not null |   none   |     密码     |     false      |
|   disable    |   boolean    |  false   |  index   |   是否禁用   |     false      |
|    phone     |   char(11)   |   null   |  index   |  用户手机号  |     false      |
|    email     | varchar(40)  |   null   |  index   |   用户邮箱   |     false      |
| create_ip_at | varchar(15)  |   null   |   none   | 创建时用户ip |     false      |
| update_ip_at | varchar(15)  |   null   |   none   |  近期登录ip  |     false      |
|  create_at   |     date     |   null   |   none   |   创建时间   |     false      |
|  update_at   |     date     |   null   |   none   | 最近登录时间 |     false      |

- user_profile 表

|  字段名  |     类型     |  默认值  | 索引类型 |   描述    | auto_increment |
| :------: | :----------: | :------: | :------: | :-------: | :------------: |
|    id    | integer(10)  | not null | primary  |  表主键   |     true      |
|    uid    | integer(10)  | not null | forgekey  |  外键   |     false      |
|   uimg   | varchar(255) |   null   |   none   | 用户头像  |     false      |
|   gender   |  string(5)   |   none   |  index   |   性别    |     false      |
| profile |     text     |   null   |   none   | 简介描述  |     false      |
|  isVip   |   boolean    |  false   |  index   | 是否是vip |     false      |
|  create_at   |     date     |   null   |   none   |   创建时间   |     false      |
|  update_at   |     date     |   null   |   none   | 最近修改时间 |     false      |

- login_log 表
  
|  字段名  |     类型     |  默认值  | 索引类型 |   描述    | auto_increment |
| :------: | :----------: | :------: | :------: | :-------: | :------------: |
|    id    | integer(10)  | not null | primary  |  表主键   |     true      |
|    uid    | integer(10)  | not null | forgekey  |  外键   |     false      |
|   login_ip   | varchar(15) |   null   |   none   | 每一次登录的ip  |     false      |
|  create_at   |     date     |   null   |   none   |   创建时间   |     false      |
|  update_at   |     date     |   null   |   none   | 最近修改时间 |     false      |

- category 表
  
|  字段名  |     类型     |  默认值  | 索引类型 |   描述    | auto_increment |
| :------: | :----------: | :------: | :------: | :-------: | :------------: |
|    id    | integer(10)  | not null | primary  |  表主键   |     true      |
|   name   | varchar(15) |   null   |   none   | 分类名称  |     false      |
|  create_at   |     date     |   null   |   none   |   创建时间   |     false      |
|  update_at   |     date     |   null   |   none   | 最近修改时间 |     false      |

- product 表
  
|  字段名  |     类型     |  默认值  | 索引类型 |   描述    | auto_increment |
| :------: | :----------: | :------: | :------: | :-------: | :------------: |
|    id    | integer(10)  | not null | primary  |  表主键   |     true      |
|    cid    | integer(10)  | not null | forgekey  |  外键   |     false      |
|    uid    | integer(10)  | not null | forgekey  |  外键   |     false      |
|   name   | varchar(15) |   null   |   none   | 产品名称  |     false      |
|   desc   | text |   null   |   none   | 产品描述  |     false      |
|   isSole   | boolean |   false   |   index   | 是否为独家产品  |     false      |
|  create_at   |     date     |   null   |   none   |   创建时间   |     false      |
|  update_at   |     date     |   null   |   none   | 最近修改时间 |     false      |

- step 表
  
|  字段名  |     类型     |  默认值  | 索引类型 |   描述    | auto_increment |
| :------: | :----------: | :------: | :------: | :-------: | :------------: |
|    id    | integer(10)  | not null | primary  |  表主键   |     true      |
|    pid    | integer(10)  | not null | forgekey  |  外键   |     false      |
|    content    | varchar(1000)  | not null | none  |  具体内容   |     false      |
|  create_at   |     date     |   null   |   none   |   创建时间   |     false      |
|  update_at   |     date     |   null   |   none   | 最近修改时间 |     false      |

- comment 表
  
|  字段名  |     类型     |  默认值  | 索引类型 |   描述    | auto_increment |
| :------: | :----------: | :------: | :------: | :-------: | :------------: |
|    id    | integer(10)  | not null | primary  |  表主键   |     true      |
|    pid    | integer(10)  | not null | forgekey  |  外键   |     false      |
|    uid    | integer(10)  | not null | forgekey  |  外键   |     false      |
|  content   |     text     |   null   |   none   |   评论内容   |     false      |
|  create_at   |     date     |   null   |   none   |   创建时间   |     false      |
|  update_at   |     date     |   null   |   none   | 最近修改时间 |     false      |

- collection 表
  
|  字段名  |     类型     |  默认值  | 索引类型 |   描述    | auto_increment |
| :------: | :----------: | :------: | :------: | :-------: | :------------: |
|    id    | integer(10)  | not null | primary  |  表主键   |     true      |
|    pid    | integer(10)  | not null | forgekey  |  外键   |     false      |
|    uid    | integer(10)  | not null | forgekey  |  外键   |     false      |
|  create_at   |     date     |   null   |   none   |   创建时间   |     false      |
|  update_at   |     date     |   null   |   none   | 最近修改时间 |     false      |

- like 表
  
|  字段名  |     类型     |  默认值  | 索引类型 |   描述    | auto_increment |
| :------: | :----------: | :------: | :------: | :-------: | :------------: |
|    id    | integer(10)  | not null | primary  |  表主键   |     true      |
|    pid    | integer(10)  | not null | forgekey  |  外键   |     false      |
|    uid    | integer(10)  | not null | forgekey  |  外键   |     false      |
|  create_at   |     date     |   null   |   none   |   创建时间   |     false      |
|  update_at   |     date     |   null   |   none   | 最近修改时间 |     false      |

- Ingredients 表
  
|  字段名  |     类型     |  默认值  | 索引类型 |   描述    | auto_increment |
| :------: | :----------: | :------: | :------: | :-------: | :------------: |
|    id    | integer(10)  | not null | primary  |  表主键   |     true      |
|    pid    | integer(10)  | not null | forgekey  |  外键   |     false      |
|    mainstuff    | varchar(1000)  | not null | none  |  主料   |     false      |
|    secondstuff    | varchar(1000)  | not null | none  |  辅料   |     false      |
|  create_at   |     date     |   null   |   none   |   创建时间   |     false      |
|  update_at   |     date     |   null   |   none   | 最近修改时间 |     false      |

## 后端使用的技术
1. koa
2. sequelize