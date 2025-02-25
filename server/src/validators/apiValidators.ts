import {body} from 'express-validator';

const articleValidators = () => {
    return [
        body("owner").escape(),
        body("parent").escape(),
        body("color").escape(),
        body("header").escape(),
        body("content").escape(),
        body("tags").escape()
    ]
};

const collectionValidators = () => {
    return [
        body("owner").escape(),
        body("name").escape()
    ]
}


export { articleValidators, collectionValidators };
