import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomePage from '@/pages/HomePage';

jest.mock('expo-location', () => ({
    requestForegroundPermissionsAsync: jest.fn(),
    getCurrentPositionAsync: jest.fn()
}));

jest.mock('socket.io-client', () => {
    const mockSocket = {
        on: jest.fn(),
        emit: jest.fn(),
        disconnect: jest.fn()
    };
    return jest.fn(() => mockSocket);
});

describe('HomePage', () => {
    it('should request location permissions on mount', async () => {
        render(<HomePage />);
        await waitFor(() => {
            expect(Location.requestForegroundPermissionsAsync).toHaveBeenCalled();
        });
    });

    it('should display an error message if location permission denied', async () => {
        Location.requestForegroundPermissionsAsync.mockResolvedValue({ status: 'denied' });

        const { getByText } = render(<HomePage />);
        await waitFor(() => {
            expect(getByText('Permission to access location was denied')).toBeInTheDocument();
        });
    });

    it('should fetch initial drivers from the socket server', async () => {
        const mockDrivers = [
            { id: '1', name: 'Alice', latitude: 1.2, longitude: 3.4, updates: [] },
            { id: '2', name: 'Bob', latitude: 5.6, longitude: 7.8, updates: [] }
        ];

        // Resolve 'drivers' event with mock data 
        const mockSocket = io(); // Using your imported mock
        mockSocket.on.mockImplementation((event, cb) => {
            if (event === 'drivers') cb(mockDrivers);
        });

        const { findAllByTestId } = render(<HomePage />);

        await waitFor(() => {
            expect(findAllByTestId('driver-marker')).resolves.toHaveLength(2);
        });
    });
});