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
    expiration VARCHAR(24) NOT NULL DEFAULT '',
    block_num int NOT NULL,
    cpu int NOT NULL,
    net int NOT NULL,
    contract_ VARCHAR(20) NOT NULL DEFAULT '',
    action_ VARCHAR(20) NOT NULL DEFAULT '',
    actor VARCHAR(20) NOT NULL DEFAULT '',
    data_ JSON,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) engine=innodb default charset=utf8;


CREATE TABLE IF NOT EXISTS assets (
    username VARCHAR(12) NOT NULL DEFAULT '',
    contract_ VARCHAR(20)  NOT NULL DEFAULT '',
    quantity DECIMAL(18,4) NOT NULL,
    symbol VARCHAR(20) NOT NULL DEFAULT '',
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) engine=innodb default charset=utf8;


CREATE TABLE IF NOT EXISTS tokens (
    contract_ VARCHAR(20)  NOT NULL DEFAULT '',
    symbol VARCHAR(12) NOT NULL DEFAULT '',
    maxsupply VARCHAR(36) NOT NULL DEFAULT '',
    supply VARCHAR(36) NOT NULL DEFAULT '',
    precision_ VARCHAR(36) NOT NULL DEFAULT '',
    logo VARCHAR(256)  NOT NULL DEFAULT '',
    price DECIMAL(18,4),
    site_ VARCHAR(56),
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) engine=innodb default charset=utf8;


ALTER TABLE transactions ADD INDEX index_hash (hash_);
ALTER TABLE transactions ADD INDEX index_block_num (block_num);
ALTER TABLE transactions ADD INDEX index_contract (contract_);
ALTER TABLE transactions ADD INDEX index_actor (actor);

ALTER TABLE assets ADD INDEX index_username_contract (username, contract_);

insert into tokens(contract_, symbol, maxsupply, supply, price, logo) value('roxe.token', 'ROC', '10168899787.6080', '2167937971.6635', '55934.77', 'https://55-uat-log.s3-ap-northeast-1.amazonaws.com/ROC.png');
insert into tokens(contract_, symbol, maxsupply, supply, price, logo) value('roxe.ro', 'BTC', '21000000.00000000', '0.00001395', '55934.77', 'https://55-uat-log.s3-ap-northeast-1.amazonaws.com/roBTC.png');
insert into tokens(contract_, symbol, maxsupply, supply, price, logo) value('roxe.ro', 'ETH', '4611686018.000000000', '0.000000000', '3441.27', 'https://55-uat-log.s3-ap-northeast-1.amazonaws.com/roETH.png');
insert into tokens(contract_, symbol, maxsupply, supply, price, logo) value('roxe.ro', 'USDT', '4611686018.000000000', '0.000000000', '1.00', 'https://55-uat-log.s3-ap-northeast-1.amazonaws.com/roUSDT.png');
insert into tokens(contract_, symbol, maxsupply, supply, price, logo) value('roxe.ro', 'USDC', '4611686018.000000000', '0.000000000', '1.00', 'https://55-uat-log.s3-ap-northeast-1.amazonaws.com/roUSDC.png');
insert into tokens(contract_, symbol, maxsupply, supply, price, logo) value('roxe.ro', 'USD', '4611686018.000000000', '25231.190000', '1.00', 'https://55-uat-log.s3-ap-northeast-1.amazonaws.com/roUSD.png');
insert into tokens(contract_, symbol, maxsupply, supply, price, logo) value('roxe.ro', 'GBP', '4611686018.000000000', '9091.760000', '1.3904', 'https://55-uat-log.s3-ap-northeast-1.amazonaws.com/roGBP.png');
insert into tokens(contract_, symbol, maxsupply, supply, price, logo) value('roxe.ro', 'HKD', '4611686018.000000000', '98868.300000', '0.1288', 'https://55-uat-log.s3-ap-northeast-1.amazonaws.com/roHKD.png');

insert into accounts(username, ownerkey, activekey) value('roxe', 'ROXE8MBBU6zdAFHXFb8235Qg5u3LSJvg2VzbjfqEpXTEc5asGe6XZH', 'ROXE8MBBU6zdAFHXFb8235Qg5u3LSJvg2VzbjfqEpXTEc5asGe6XZH');

insert into tokens(contract_, symbol, maxsupply, supply, price, logo) value('roxe.token', 'ROC', '10000000000.0000', '10000000000.0000', '0.2291');
