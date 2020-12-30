import { NewContactDto, ContactDto } from '../../dtos/contact.dto';
import { ContactService } from './contact.service';
import { ContactModule } from './contact.module';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { exception } from 'console';
import DatabaseModule, {
  closeMongoConnection,
} from '../database/database-test.module';
import { ContactSchema } from '../../schemas/contact.schema';

describe('The ContactService', () => {
  let connection: Connection;
  let service: ContactService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        DatabaseModule({
          connectionName: (new Date().getTime() * Math.random()).toString(16),
        }),
        MongooseModule.forFeature([{ name: 'Test', schema: ContactSchema }]),
        ContactModule,
      ],
      providers: [NewContactDto, NewContactDto],
    }).compile();

    service = module.get<ContactService>(ContactService);
    connection = module.get<Connection>(getConnectionToken());
  });

  afterEach(async () => {
    await connection?.dropDatabase();
    await connection?.collection('contacts').deleteMany({});
    await connection?.close();
    await closeMongoConnection();
    await module?.close();
  });

  afterAll(async () => {
    await connection?.close();
    await closeMongoConnection();
    await module?.close();
  });

  it('service should be defined', async () => {
    expect(service).toBeDefined();
  });

  describe('when create a contact', () => {
    it('should return a created contact', async () => {
      const insertedResult = <ContactDto>(
        await service.createContact(newContact)
      );
      expect(insertedResult).toBeInstanceOf(Model);
    });

    it('should return a contact equal to the one created', async () => {
      const insertedResult = <ContactDto>(
        await service.createContact(newContact)
      );
      const { name, email, birth, occupation } = insertedResult;
      expect({ name, email, birth, occupation }).toEqual({
        ...newContact,
      });
    });

    it('should return a contact with "id"', async () => {
      const insertedResult = <ContactDto>(
        await service.createContact(newContact)
      );
      expect(insertedResult).toHaveProperty('_id');
    });
  });

  describe('when find a contact', () => {
    it('should return a contact', async () => {
      const insertedResult = <ContactDto>(
        await service.createContact(newContact)
      );
      const findedResult = <ContactDto>(
        await service.getContactById(insertedResult._id)
      );
      expect(findedResult).toBeInstanceOf(Model);
    });

    it('should throw an not found exception', async () => {
      try {
        const { name, email, birth, occupation } = newContact;
        const _id = '5fec1f5aacb8788fd9e73aee';
        await service.updateContact(_id, {
          name,
          email,
          birth,
          occupation,
          _id,
        });
        throw new exception('Erro inesperado');
      } catch (error) {
        expect(error.message).toBe(
          'Operação cancelada. Contato não localizado.',
        );
      }
    });
  });

  describe('when get all contacts', () => {
    it('should return a contact list with 0 items', async () => {
      const contactList = await service.getContacts();
      expect(contactList).toHaveLength(0);
    });

    it('should return a contact list with 1 item', async () => {
      await service.createContact(newContact);
      const contactList = await service.getContacts();
      expect(contactList).toHaveLength(1);
    });
  });

  describe('when update a contact', () => {
    it('should return a updated contact', async () => {
      const insertedResult = <ContactDto>(
        await service.createContact(newContact)
      );
      const { email, birth, _id } = insertedResult;
      const updatedResult = <ContactDto>await service.updateContact(_id, {
        name: 'Edgar Damasceno Silva',
        email,
        birth,
        occupation: 'PROFESSOR',
        _id,
      });
      expect(updatedResult).toBeInstanceOf(Model);
    });

    it('should throw an forbiden exception', async () => {
      try {
        const insertedResult = <ContactDto>(
          await service.createContact(newContact)
        );
        const { name, email, birth, occupation, _id } = insertedResult;
        await service.updateContact(_id, {
          name,
          email,
          birth,
          occupation,
          _id: _id.toString().split('').reverse().join(),
        });
        throw new exception('Erro inesperado');
      } catch (error) {
        expect(error.message).toBe(
          'Operação cancelada. O campo "id" é imutável.',
        );
      }
    });

    it('should throw an not found exception', async () => {
      try {
        const { name, email, birth, occupation } = newContact;
        const _id = '5fec1f5aacb8788fd9e73aee';
        await service.updateContact(_id, {
          name,
          email,
          birth,
          occupation,
          _id,
        });
        throw new exception('Erro inesperado');
      } catch (error) {
        expect(error.message).toBe(
          'Operação cancelada. Contato não localizado.',
        );
      }
    });
  });

  describe('when delete a contact', () => {
    it('should return a contact', async () => {
      const insertedResult = <ContactDto>(
        await service.createContact(newContact)
      );
      const deletedResult = <ContactDto>(
        await service.deleteContact(insertedResult._id)
      );
      expect(deletedResult).toBeInstanceOf(Model);
    });

    it('should throw an not found exception', async () => {
      try {
        const _id = '5fec1f5aacb8788fd9e73aee';
        await service.deleteContact(_id);
        throw new exception('Erro inesperado');
      } catch (error) {
        expect(error.message).toBe(
          'Operação cancelada. Contato não localizado.',
        );
      }
    });
  });

  const newContact: NewContactDto = {
    name: 'Edgar Damasceno',
    birth: new Date('1985/10/20'),
    email: 'edgar.damasceno@hotmail.com',
    occupation: 'ANALISTA SISTEMAS',
  };
});
