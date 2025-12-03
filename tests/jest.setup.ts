jest.mock("../config/firebaseConfig", () => {
    const mockDoc = {
        id: "mockDocId",
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        get: jest.fn(),
    };

    const mockCollection = {
        doc: jest.fn(() => mockDoc),
        add: jest.fn(async (data) => ({ id: "newMockId", ...data })),
        get: jest.fn(),
        where: jest.fn().mockReturnThis(),
    };

    const mockBatch = {
        delete: jest.fn(),
        commit: jest.fn(),
    };

    return {
        auth: {
            verifyIdToken: jest.fn(),
            getUser: jest.fn(),
        },
        db: {
            collection: jest.fn(() => mockCollection),
            batch: jest.fn(() => mockBatch),
            runTransaction: jest.fn(async (fn) => {
                const t = {
                    get: jest.fn(),
                    set: jest.fn(),
                    update: jest.fn(),
                    delete: jest.fn(),
                };
                return fn(t);
            }),
        },
    };
});

// Reset mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});

// Clean loaded modules
afterAll(() => {
    jest.resetModules();
});
