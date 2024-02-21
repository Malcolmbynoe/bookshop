import express from "express";

const app = express();
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})

app.get('/', (req, res) => {
    res.status(212).send("hello here");
})

app.get('/j/:id', (req, res) => {
    const data ='the joke is here'+ req.params.id *2
    res.send(data)
})
