import { Request, Response } from "express";
import taskCard from '../model/taskCard';

const cardsList = Array<taskCard>({
    id: 1,
    title: 'TEC-34',
    description: 'TEC-34 description',
    comments: [],
    cardType: 'Epic',
    assign: { userId: 'userA', userName: 'Kuro', userIcon: 'temp' },
    label: 'none',
    sprint: 'Sprint 2',
    storyPointEstimate: 'none',
    commitNum: 0,
    pullRequestNumber: 0,
    reporter: { userId: 'userA', userName: 'Kuro', userIcon: 'temp' },
    createTime: new Date().toString()
  });

//GET ALL
exports.index = (req: Request, res: Response) => {
  res.status(200).send(cardsList);
};

//GET ONE
exports.show = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = cardsList.findIndex(card => card.id === id);
    return index >= 0 ? 
        res.status(200).send(cardsList[index]) : 
        res.status(400).send(false);
    
    
};

//POST
exports.store = (req: Request, res: Response) => {
    const id = cardsList.length == 0 ? 0 : cardsList[cardsList.length - 1].id + 1;
    const createTime = new Date().toString();
    const card = {...req.body, id, createTime};
    cardsList.push(card);
    res.status(201).send(true);
};

//PUT
exports.update = (req: Request, res: Response) => {
    const id = parseInt(req.body.id);
    const index = cardsList.findIndex(card => card.id === id);
    if(index >= 0){
        cardsList[index] = {...req.body};
        res.status(200).send(true);
    }
    return res.status(400).send(false);
};

//DELETE
exports.delete = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = cardsList.findIndex(card => card.id === id);
    if (index >= 0) {
        cardsList.splice(index, 1);
        return res.status(200).send(true);
    }
    return res.status(400).send(false);
};