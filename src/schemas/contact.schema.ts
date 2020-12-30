import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema()
export class Contact {
  @Prop({
    type: String,
    required: true,
    maxlength: 50,
    minlength: 3,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    maxlength: 100,
    minlength: 5,
  })
  email: string;

  @Prop({
    type: Date,
    required: true,
  })
  birth: Date;

  @Prop({
    type: String,
    enum: ['MÉDICO', 'PROFESSOR', 'ANALISTA SISTEMAS'],
    required: true,
  })
  occupation: 'MÉDICO' | 'PROFESSOR' | 'ANALISTA SISTEMAS';
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
