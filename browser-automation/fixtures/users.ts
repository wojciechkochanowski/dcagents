import { User, UserRoleLabel } from './types'

export const users: User[] = [
  {
    email: 'admin@cypress.datacapt',
    password: 'qweASD123_',
    company: 'admin company',
    firstName: 'adminFirstName',
    lastName: 'adminLastName',
    role: UserRoleLabel.ADMIN,
  },
  {
    email: 'investigator@cypress.datacapt',
    password: 'zxcGHJ543*',
    company: 'investigator company',
    firstName: 'investigatorFirstName',
    lastName: 'investigatorLastName',
    role: UserRoleLabel.INVESTIGATOR,
    passwordToBeChanged: 'jklXCV234%',
    invitationToken: '0123456789012345678901234567890123456789012345678901234567890123',
  },
  {
    email: 'another@cypress.datacapt',
    password: 'zxcDcJ543?',
    company: 'another company',
    firstName: 'anotherFirstName',
    lastName: 'anotherLastName',
    role: UserRoleLabel.ADMIN,
  },
  {
    email: 'monitor@cypress.datacapt',
    password: 'zxcDcJ543?',
    company: 'monitor company',
    firstName: 'monitorFirstName',
    lastName: 'monitorLastName',
    role: UserRoleLabel.ADMIN,
  },
]
