import './App.scss';
import React, { useEffect } from 'react';
import LoggedOutHeader from './components/layout/Header/LoggedOutHeader';
import { BrowserRouter as Router } from 'react-router-dom';
import UserService from './services/userService';
import { useAppSelector, useAppDispatch } from './hooks';
import { MidScreenLoader } from './components/common';
import { Box, Container, useMediaQuery, Toolbar, Theme } from '@mui/material';
import LoggedInHeader from './components/layout/Header/LoggedInHeader';
import UnauthenticatedRoutes from './routes/UnauthenticatedRoutes';
import AuthenticatedRoutes from './routes/AuthenticatedRoutes';
import { Notification } from 'components/common/notification';
import PageViewTracker from 'routes/PageViewTracker';

const App = () => {
    const drawerWidth = 240;
    const isMediumScreen: boolean = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector((state) => state.user.authentication.authenticated);
    const authenticationLoading = useAppSelector((state) => state.user.authentication.loading);

    useEffect(() => {
        UserService.initKeycloak(dispatch);
    }, [dispatch]);

    if (authenticationLoading) {
        return <MidScreenLoader />;
    }

    if (!isLoggedIn) {
        return (
            <Router>
                <PageViewTracker />
                <Notification />
                <LoggedOutHeader />
                <UnauthenticatedRoutes />
            </Router>
        );
    }

    if (!isMediumScreen) {
        return (
            <Router>
                <LoggedInHeader />
                <Container>
                    <Toolbar />
                    <AuthenticatedRoutes />
                </Container>
            </Router>
        );
    }

    return (
        <Router>
            <Box sx={{ display: 'flex' }}>
                <LoggedInHeader drawerWidth={drawerWidth} />
                <Notification />
                <Box component="main" sx={{ flexGrow: 1, width: `calc(100% - ${drawerWidth}px)`, marginTop: '17px' }}>
                    <Toolbar />
                    <AuthenticatedRoutes />
                </Box>
            </Box>
        </Router>
    );
};
export default App;
