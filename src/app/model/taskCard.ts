interface TaskCard {
    id: number;
    title: string;
    description: string;
    comments: { userId: string; userName: string; userIcon: string; comments: string }[];
    cardType: string;
    assign: { userId: string; userName: string; userIcon: string };
    label: string;
    sprint: string;
    storyPointEstimate: string;
    commitNum: number;
    pullRequestNumber: number;
    reporter: { userId: string; userName: string; userIcon: string };
    createTime: string;
}

export default TaskCard;