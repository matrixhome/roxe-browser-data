CREATE TABLE IF NOT EXISTS accounts (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(12) NOT NULL DEFAULT '',
    ownerkey VARCHAR(54)  NOT NULL DEFAULT '',
    activekey VARCHAR(54)  NOT NULL DEFAULT '',
    creator VARCHAR(12) NOT NULL DEFAULT '',
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) engine=innodb default charset=utf8;


CREATE TABLE IF NOT EXISTS transactions (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    hash_ VARCHAR(64) NOT NULL DEFAULT '',
    expiration VARCHAR(20) NOT NULL DEFAULT '',
    ref_block_num int NOT NULL,
    ref_block_prefix int NOT NULL,
    cpu int NOT NULL,
    net int NOT NULL,
    contract_ VARCHAR(20) NOT NULL DEFAULT '',
    action_ VARCHAR(20) NOT NULL DEFAULT '',
    data_ json,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) engine=innodb default charset=utf8;


CREATE TABLE IF NOT EXISTS assets (
    username VARCHAR(12) NOT NULL DEFAULT '',
    contract_ VARCHAR(20)  NOT NULL DEFAULT '',
    quantity DECIMAL(18,4) NOT NULL,
    symbol VARCHAR(20) NOT NULL DEFAULT '',
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) engine=innodb default charset=utf8;




