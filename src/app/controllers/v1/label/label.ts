import { Request, Response } from 'express';

exports.index = async (req: Request, res: Response) => {
  const tags = [
    {
      id: '1',
      name: 'None',
    },
    {
      id: '2',
      name: 'Frontend',
    },
    {
      id: '3',
      name: 'Backend',
    },
  ];
      
  res.send(tags);
};