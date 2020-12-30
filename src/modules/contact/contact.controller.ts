import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { UsePipes } from '@nestjs/common/decorators/core/use-pipes.decorator';
import { NewContactDto, ContactDto } from '../../dtos/contact.dto';
import { Contact } from '../../schemas/contact.schema';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactsService: ContactService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createContact(@Body() NewContactDto: NewContactDto) {
    return await this.contactsService.createContact(NewContactDto);
  }

  @Get()
  async getContacts(): Promise<Contact[]> {
    return await this.contactsService.getContacts();
  }

  @Get(':id')
  async getContactById(@Param('id') id: string): Promise<Contact> {
    return await this.contactsService.getContactById(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateContact(
    @Param('id') id: string,
    @Body() updatedContact: ContactDto,
  ): Promise<Contact> {
    return await this.contactsService.updateContact(id, updatedContact);
  }

  @Delete(':id')
  async deleteContact(@Param('id') id: string): Promise<Contact> {
    return await this.contactsService.deleteContact(id);
  }
}
