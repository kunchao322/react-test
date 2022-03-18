/**
 * @jest-environment node
 */
import {createTuit, findTuitById, deleteTuit, findAllTuits, updateTuit} from "../services/tuits-service";
import {
    createUser,findUserById,
    deleteUsersByUsername, findAllUsers,
} from "../services/users-service";
import data from "../../public/js/tuits-data.js";


describe('can create tuit with REST API', () => {
    const  user = {
        username: 'testUser',
        password: 'lv426',
        email: 'ellenripley@aliens.com'
    }

    beforeAll(() =>  {
        return deleteUsersByUsername(user.username);
    });

    afterAll(async () => {
        return deleteUsersByUsername(user.username);
    })

    test('Create tuit by mock user', async () =>{
        const newUser = await createUser(user);

        for(const tuit of data){
            //This is the create a tuit to be tested
            const newTuit = await createTuit(newUser._id, tuit);
            //expect the new results matches with the content passed in
            expect(newTuit.tuit).toEqual(tuit.tuit);
            expect(newTuit.postedBy).toEqual(newUser._id);
            expect(newTuit.stats.likes).toEqual(tuit.stats.likes);
            expect(newTuit.stats.retuits).toEqual(tuit.stats.retuits);
            expect(newTuit.stats.replies).toEqual(tuit.stats.replies);
            await deleteTuit(newTuit._id);
        }
    } )
});

describe('can delete tuit wtih REST API', () => {
    const  user = {
        username: 'testUser',
        password: 'lv426',
        email: 'ellenripley@aliens.com'
    }

    test('Delete tuit by tid', async () =>{
        //create a new user to post a tuit
        const newUser = await createUser(user);
        //use data[0] as test data
        const tuit = data[0];
        //create mocktuit with above content
        const mockTuit = await  createTuit(newUser._id, tuit);
        //test the delete API
        const status = await  deleteTuit(mockTuit._id);
        expect(status.deletedCount).toBeGreaterThanOrEqual(1);
    } )
});

describe('can retrieve a tuit by their primary key with REST API',  () => {
    const  user = {
        username: 'testUser',
        password: 'lv426',
        email: 'ellenripley@aliens.com'
    }

    beforeAll(async () =>{
        await  deleteUsersByUsername(user.username);

    })

    afterAll(async () =>{
         await deleteUsersByUsername(user.username);
    })

    test('Find tuit by tid', async () =>{

        const newUser = await createUser(user);

        for(const tuit of data){
            const mockTuit = await createTuit(newUser._id, tuit);
            const getMockTuit = await  findTuitById(mockTuit._id);

            expect(getMockTuit.tuit).toEqual(tuit.tuit);
            expect(getMockTuit.postedBy._id).toEqual(newUser._id);
            expect(getMockTuit.stats.likes).toEqual(tuit.stats.likes);
            expect(getMockTuit.stats.retuits).toEqual(tuit.stats.retuits);
            expect(getMockTuit.stats.replies).toEqual(tuit.stats.replies);

            await  deleteTuit(mockTuit._id);
        }


    } )
});

describe('can retrieve all tuits with REST API', () => {

    // sample users we'll insert to then retrieve
    const usernames = [
        "larry", "curley", "moe"
    ];

    // setup data before test
    beforeAll(
        () =>
        // insert several known users
        usernames.map(username =>
            createUser({
                username,
                password: `${username}123`,
                email: `${username}@stooges.com`
            })
        )
    );

    // clean up after ourselves
    afterAll(() =>
        // delete the users we inserted
        Promise.all(usernames.map(username =>
            deleteUsersByUsername(username)
        ))
    );

    test('can retrieve all tuits from REST API', async () => {
        const tuitsBefore = await  findAllTuits();
        expect(tuitsBefore.length).toBeGreaterThanOrEqual(0);

        const users = await  findAllUsers();
        // there should be a minimum number of users
        expect(users.length).toBeGreaterThanOrEqual(usernames.length);

        // let's check each user we inserted
        const usersWeInserted = users.filter(
            user => usernames.indexOf(user.username) >= 0);

        // get all user ids
        const userIds = [];
        usersWeInserted.forEach(user => {
            const username = usernames.find(username => username === user.username);
            expect(user.username).toEqual(username);
            expect(user.password).toEqual(`${username}123`);
            expect(user.email).toEqual(`${username}@stooges.com`);
            userIds.push(user._id);
        });
        expect(userIds.length).toEqual(usernames.length);

        //each user creates a tuit to test
        let i = 0;
        const tuitsId_test = [];
        for(const tuit of data) {
            const newUser = await findUserById(userIds[i]);
            const newTuit = await createTuit(newUser._id, tuit);
            expect(newTuit.tuit).toEqual(tuit.tuit);
            expect(newTuit.postedBy).toEqual(newUser._id);
            expect(newTuit.stats.likes).toEqual(tuit.stats.likes);
            expect(newTuit.stats.retuits).toEqual(tuit.stats.retuits);
            expect(newTuit.stats.replies).toEqual(tuit.stats.replies);
            tuitsId_test.push(newTuit._id);
        }

        const tuitsAfter = await  findAllTuits();
        expect(tuitsAfter.length).toEqual(tuitsBefore.length + usernames.length);
        expect(tuitsId_test.length).toEqual(usernames.length);
        //delete tests tuit
        for(const tuitsId of tuitsId_test){
            await  deleteTuit(tuitsId);
        }


    });
});