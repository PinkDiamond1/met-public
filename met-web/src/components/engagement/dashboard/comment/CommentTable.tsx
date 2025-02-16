import React, { useContext } from 'react';
import MetTable from 'components/common/Table';
import { Comment } from 'models/comment';
import { HeadCell } from 'components/common/Table/types';
import { Skeleton, Typography } from '@mui/material';
import { CommentViewContext } from './CommentViewContext';

const CommentTable = () => {
    const { isCommentsListLoading, comments } = useContext(CommentViewContext);
    const headCells: HeadCell<Comment>[] = [
        {
            key: 'text',
            numeric: false,
            disablePadding: false,
            label: 'Content',
            allowSort: true,
            getValue: (row: Comment) => row.text,
        },
        {
            key: 'submission_date',
            numeric: false,
            disablePadding: false,
            label: 'Comment Date',
            allowSort: false,
            customStyle: { width: '20%' },
            align: 'right',
            getValue: (row: Comment) => <Typography variant="subtitle2">{row.submission_date}</Typography>,
        },
    ];

    if (isCommentsListLoading) {
        return <Skeleton variant="rectangular" width="100%" height="60m" />;
    }

    return <MetTable hideHeader={true} headCells={headCells} rows={comments} defaultSort={'submission_date'} />;
};

export default CommentTable;
