
export function mockTransaction() {
    const transactionObj = {} as any;
    transactionObj.commit = jest.fn().mockReturnValue('commit');
    transactionObj.transaction = jest.fn().mockReturnValue('transaction');
    transactionObj.rollback = jest.fn().mockReturnValue('rollback');
    return transactionObj;
}
