import arg from 'arg';
import inquirer from 'inquirer';
import { createProject } from './main'

async function proptingForMissingOptions(options) {
  const { template, skipPrompts, git} = options;
  const defaultTemplate = 'JavaScript';

  if (skipPrompts) {
    return {
      ...options,
      template: template || defaultTemplate
    }
  }

  const questions = [];
  if (!template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which project template to use.',
      choices: ['JavaScript', 'TypeScript'],
      default: defaultTemplate
    });
  }

  if (!git) {
    questions.push(
      {
        type: 'confirm',
        name: 'git',
        message: 'Initialize a git repository?',
        default: false
      }
    );
  }

  const answers = await inquirer.prompt(questions);

  return {
    ...options,
    template: template || answers.template,
    git: git || answers.git
  }
}

function parseArgsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--install': Boolean,
      '--git': Boolean,
      '--yes': Boolean,
      '-i': '--install',
      '-g': '--git',
      '-y': '--yes'
    },
    {
      argv: rawArgs.slice(2),
    }
  );

  return {
    git: args['--git'] || false,
    runInstall: args['--install'] || false,
    skipPrompts: args['--yes'] || false,
    template: args._[0]
  }
}

export async function cli(args) {
  let options = parseArgsIntoOptions(args);
  options = await proptingForMissingOptions(options);
  await createProject(options);
}

