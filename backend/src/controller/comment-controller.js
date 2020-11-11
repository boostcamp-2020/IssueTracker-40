import { CommentService } from "../service/comment-service";

const addComment = async (req, res, next) => {
    const { content } = req.body;
    const { issueId } = req.params;

    try {
        const commentService = CommentService.getInstance();
        await commentService.addComment(req.user.id, issueId, content);
        res.status(201).end();
    } catch (error) {
        next(error);
    }
};

const getComments = async (req, res, next) => {
    const { issueId } = req.params;

    try {
        const commentService = CommentService.getInstance();
        await commentService.getComments(issueId);
        res.status(200).end();
    } catch (error) {
        next(error);
    }
};

const changeComment = async (req, res, next) => {
    const { content } = req.body;
    const { commentId } = req.params;

    try {
        const commentService = CommentService.getInstance();
        await commentService.changeComment(commentId, content);
        res.status(200).end();
    } catch (error) {
        next(error);
    }
};

const removeComment = async (req, res, next) => {
    const { commentId } = req.params;

    try {
        const commentService = CommentService.getInstance();
        await commentService.removeComment(commentId);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

export { addComment, getComments, changeComment, removeComment };
