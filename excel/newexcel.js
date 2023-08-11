const exportUsersToExcel = require('./excelservice');

const users = [
    {
        id: 0,
        name: 'Salim',
        age: 31
    },
    {
        id: 1,
        name: 'Zoe',
        age: 8
    }
];

const workSheetColumnNames = [
    "ID",
    "NAME",
    "AGE"
]

const workSheetName = 'Users';
const filePath = '../outputFile/excel.xlsx';

exportUsersToExcel(users, workSheetColumnNames, workSheetName, filePath);