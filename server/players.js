const express = require('express'); // express server
const Joi = require('joi'); // input validation
const { v4: uuidv4, validate: uuidValidate } = require('uuid'); // random id
require('dotenv').config(); // environment variables
//  STILL NEED TO IMPLEMENT JWT AUTH, MAYBE SUPABASE CAN TAKE CARE OF IT TOO? rls disabled for now
const { createClient } = require('@supabase/supabase-js'); // player server

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const app = express();

app.use(express.json());

// implement a database to store user values: name, email, password, | set by us: id, # games, correct guesses, total points earned, average time

app.get('/', (req, res) => {
    res.send('Name That Tune!');
});

app.get('/leaderboard/:category', (req, res) => {
    order = false;
    if (req.params.category === 'average_time') order = true;
    getLeaderBoard(req.params.category, order).then(data => {
        res.send(data);
    }).catch(error => {
        res.status(500).send('failed to fetch leaderboard.');
    });
});

app.post('/account', (req, res) => {
    const {value, error} = validatePost(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const person = {
        id: uuidv4(), // create random id (might want v1 to protect against collisions, prob doesn't matter for this scale)
        name: req.body.name, // incoming json object should only have name, password, and email
        password: req.body.password,
        email: req.body.email
    };
    insertAccount(person).then(data => {
        res.send(data);
    }).catch(error => {
        res.status(500).send('failed to create account.');
    });
});

app.get('/account/:id', (req, res) => {
    if (!uuidValidate(req.params.id)) return res.status(400).send('improperly formatted id. uuid required.');
    getAccount(req.params.id).then(data => {
        res.send(data);
    }).catch(error => {
        console.error('Error retrieving account:', error); // 
        res.status(500).send(error.message);
    });
});

app.put('/account/:id', (req, res) => {
    if (!uuidValidate(req.params.id)) return res.status(400).send('improper id.');
    const {value, error} = validatePut(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const person = {// No id created this time!!!
        name: req.body.name, // incoming json object should only have name, password, and email
        password: req.body.password,
        email: req.body.email
    };
    updateAccount(req.params.id,person).then(data => { // filed to update vs doesn't exist
        res.send(data);
    }).catch(error => {
        console.error('Error retrieving account:', error);
        res.status(500).send(error.message);
    });
});

app.delete('/account/:id', (req,res) => {
    if (!uuidValidate(req.params.id)) return res.status(400).send('improper id.');
    deleteAccount(req.params.id).then(data => {
        res.send(data);
    }).catch(error => {
        console.error('error deleting user.'); // failed to delete vs doesn't exist
        res.status(500).send(error.message);
    });
});

// validation functions
function validatePost(body) {
    const schema = Joi.object({
        name: Joi.string().alphanum().min(2).required(),
        password: Joi.string().min(8).pattern(/[A-Z]/).pattern(/[a-z]/).pattern(/\d/).pattern(/[\W]/).required(),
        email: Joi.string().email().required(),
    });
    const result = schema.validate(body);
    console.log(result);
    return result;
}

function validatePut(body) {
    const schema = Joi.object({
        name: Joi.string().alphanum().min(2),
        password: Joi.string().min(8).pattern(/[A-Z]/).pattern(/[a-z]/).pattern(/\d/).pattern(/[\W]/),
        email: Joi.string().email(),
    });
    const result = schema.validate(body);
    console.log(result);
    return result;
}
// supabase await functions 

async function getLeaderBoard(sortBy, ascending) {
    const { data, error } = await supabase.from('Users').select(`name, email, ${sortBy}`).order(sortBy, {ascending}).neq(sortBy, 0);
    if (error) return Promise.reject(error);
    return data;
}

async function getAccount(id) {
    const { data, error } = await supabase.from('Users').select('*').eq('id', id);
    if (error) return Promise.reject(error);
    return data;
}

async function insertAccount(person) {
    const { data, error } = await supabase.from('Users').insert([person]).select('*');
    if (error) return Promise.reject(error);
    return data;
}
 
async function updateAccount(id, person) {
    const { data, error } = await supabase.from('Users').update(person).eq('id', id).select('*');
    if (error) return Promise.reject(error);
    return data;
}

async function deleteAccount(id) {
    const { data, error } = await supabase.from('Users').delete().eq('id', id).select('*');
    if (error) return Promise.reject(error);
    return data;
}
// setting up a port and a listener - CRUCIAL
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));