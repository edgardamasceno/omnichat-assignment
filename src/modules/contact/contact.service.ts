import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewContactDto, ContactDto } from '../../dtos/contact.dto';
import { Contact, ContactDocument } from '../../schemas/contact.schema';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
  ) {}

  async createContact(newContactDto: NewContactDto): Promise<Contact> {
    try {
      const { name, email, birth, occupation } = newContactDto;
      const createdContact = new this.contactModel({
        name,
        email,
        birth,
        occupation,
      });
      return createdContact.save();
    } catch (error) {
      throw error;
    }
  }

  async getContacts(): Promise<Contact[]> {
    try {
      return await this.contactModel.find().exec();
    } catch (error) {
      throw error;
    }
  }

  async getContactById(id: string): Promise<Contact> {
    try {
      const contact = await this.contactModel.findById(id).exec();

      if (contact === null) {
        throw new NotFoundException(
          'Operação cancelada. Contato não localizado.',
        );
      } else {
        return contact;
      }
    } catch (error) {
      throw error;
    }
  }

  async updateContact(id: string, contactDto: ContactDto): Promise<Contact> {
    try {
      if (contactDto._id === id) {
        const contact = await this.contactModel.findById(id).exec();
        if (contact) {
          await this.contactModel.findByIdAndUpdate(id, contactDto).exec();
          return await this.contactModel.findById(id).exec();
        }
        throw new NotFoundException(
          'Operação cancelada. Contato não localizado.',
        );
      }
      throw new ForbiddenException(
        'Operação cancelada. O campo "id" é imutável.',
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteContact(id: string) {
    try {
      const contact = await this.contactModel.findById(id).exec();
      if (contact === null) {
        throw new NotFoundException(
          'Operação cancelada. Contato não localizado.',
        );
      } else {
        await this.contactModel.findByIdAndDelete(id).exec();
        return contact;
      }
    } catch (error) {
      throw error;
    }
  }
}
