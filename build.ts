import * as fs from 'fs-extra';

try {
  fs.removeSync('./dist');
  if(process.env.NODE_ENV === 'development') {
    fs.copySync('./.env', './dist/.env');
  }
  fs.copySync('./app/templates', './dist/app/templates');
} catch (err) {
  console.log(err);
}
