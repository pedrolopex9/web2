// Step 1  MAke sure your postgres database is on

// Install pg npm i pg

//Connection code

const {Pool,Client}= require('pg')




const connectionString='postgressql://postgres:123@localhost:5433/postgres'


const client= new Client({
    connectionString:connectionString
})

client.connect()
client.query('SELECT * FROM "Stud"', (err, res) => {
    if (err) {
        console.error('Error executing query', err);
    } else {
        console.log('Data from Stud table:', res.rows);
    }
    
    // Inserting a value into the "Stud" table
    const insertQuery = 'INSERT INTO "form" (name, mail, mobile) VALUES ($1, $2, $3)';
    const values = ['Neymar', 'Neymar@gmail.com' , 61983182792];
    
    client.query(insertQuery, values, (err, res) => {
        if (err) {
            console.error('Error inserting data', err);
        } else {
            console.log('Data inserted successfully');
        }
        
        // Ending the client connection
        client.end();
    });
});