import express from 'express';
import dotenv from 'dotenv';
import { sql } from './config/db.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT;

async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

    console.log('Database initialized successfully');
  } catch (error) {
    console.log('Error initializing database', error);
    process.exit(1);
  }
}

app.use(express.json());

app.get("/", (req,res) => {
    res.send("Hello World");
})

app.post("/api/transactions", async (req,res) => {
    // title, ammount, category, user_id
    try {
        const {title, amount, category, user_id} = req.body;

        if(!title || !user_id || !category || amount ===undefined) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const transaction = await sql`
        INSERT INTO transactions(user_id, title, amount, category)
        VALUES(${user_id}, ${title}, ${amount}, ${category})
        RETURNING *
        `

        console.log(transaction)
        res.status(201).json(transaction[0])


    } catch (error) {
        console.log("Error creating transaction", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})

initDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
})
