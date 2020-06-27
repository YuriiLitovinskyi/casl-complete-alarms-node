const sqlite3 = require('sqlite3');  //.verbose()
const fs = require('fs');
const path = require('path');

//const dbFile = __dirname + '/data.db';
//const dbFile = "D:/Work/casl-complete-alarms-node/data.db"; 
//const dbFile = "D:/casl_cloud/db-driver/data.db";
//const dbFile = path.join(path.dirname(process.execPath), 'data.db');
const dbFile = process.cwd() + '/data.db';
const existDb = fs.existsSync(dbFile);


const sleep = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);        
    });
};

const completeAllDbAlarms = (db, callback) => {    
    db.serialize(() => {
        db.run("UPDATE alarm SET finished_by_pult = 1 WHERE finished_by_pult = 0");

        db.run(`
            INSERT INTO user_action (dict_action_type, action_data, action_data2, user_id, user_ip, time)
            SELECT 12, action_data, NULL, 0, "127.0.0.1", CAST((julianday("now") - 2440587.5) * 86400000.0 AS int)
            FROM (SELECT
            action_data, max(time) as time, dict_action_type, action_data2, user_id, user_ip, time
            FROM user_action
            WHERE dict_action_type IN (10, 11, 12 , 13, 20, 21, 22)
            GROUP BY action_data)
            WHERE dict_action_type <> 12
        `);    
    })
    callback();
};

const connectToDb = async (callback) => {
    try {        
        const db = new sqlite3.Database("data.db");
        console.log('Connected to DB!');
        callback(db);
    } catch (error) {
        console.log(error);
        await sleep(5000);
    }
};


(async () => {
    if(!existDb){
        console.log('Cannot find database file in current directory...');
        await sleep(5000);
    } else {
        connectToDb(async (db) => {
            try {         
                completeAllDbAlarms(db, async () => {
                    console.log('All alarms in DB were completed!');
                    db.close();
                    await sleep(5000);
                })        
            } catch (error) {
                console.log(error);
                await sleep(5000);
            }
        });
    }
})();










