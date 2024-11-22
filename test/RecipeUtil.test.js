const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const { app, server } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let baseUrl;
const recipeId = '1731281616432197'; // ID from your recipe.json

describe('Resource API', () => {
    before(async () => {
        const { address, port } = await server.address();
        baseUrl = `http://${address === '::' ? 'localhost' : address}:${port}`;
    });

    after(() => {
        return new Promise((resolve) => {
            server.close(() => {
                resolve();
            });
        });
    });

    // Test Suite for updating recipe
    describe('PUT /updateRecipe/:id', () => {
        it('Should update an existing recipe', (done) => {
            chai.request(baseUrl)
                .put(`/updateRecipe/${recipeId}`)
                .send({
                    recipeName: 'Updated Salad Recipe',
                    description: 'A delicious updated salad recipe',
                    ingredients: ['Updated lettuce', 'Updated sauce'], // Changed to array for better structure
                    steps: 'Mix updated lettuce, add updated sauce, serve in a bowl',
                    imageLink: 'https://example.com/updated-salad-image.jpg',
                })
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(200); // Confirm status matches your implementation
                    expect(res.body.message).to.equal('Recipe modified successfully!');
                    done();
                });
        });

        it('Should return 404 if recipe ID does not exist', (done) => {
            chai.request(baseUrl)
                .put(`/updateRecipe/nonexistentID`)
                .send({
                    recipeName: 'Nonexistent Recipe',
                })
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(404);
                    expect(res.body.message).to.equal('Recipe not found, unable to modify!');
                    done();
                });
        });
    });
});
