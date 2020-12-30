import { Transform, Type } from 'class-transformer/decorators';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsDate,
  MinLength,
  MaxLength,
  MinDate,
  MaxDate,
} from 'class-validator';

export enum Occupation {
  'MÉDICO',
  'PROFESSOR',
  'ANALISTA SISTEMAS',
}

export class NewContactDto {
  @IsString({ message: 'O campo NOME deve conter uma string.' })
  @IsNotEmpty({ message: 'O campo NOME não pode ser vazio.' })
  @MinLength(3, { message: 'O campo NOME deve conter no mínimo 3 caracteres.' })
  @MaxLength(50, {
    message: 'O campo NOME deve conter no máximo 50 caracteres.',
  })
  readonly name: string;

  @IsEmail(
    {},
    { message: 'O campo E-MAIL deve conter um endereço de e-mail válido.' },
  )
  @IsString({ message: 'O campo E-MAIL deve conter uma string.' })
  @IsNotEmpty({ message: 'O campo E-MAIL não pode ser vazio.' })
  @MinLength(3, {
    message: 'O campo E-MAIL deve conter no mínimo 5 caracteres.',
  })
  @MaxLength(50, {
    message: 'O campo E-MAIL deve conter no máximo 100 caracteres.',
  })
  @Transform((email) => email.toLowerCase())
  readonly email: string;

  @Type(() => Date)
  @IsDate({ message: 'O campo DATA NASCIMENTO deve conter uma data válida.' })
  @IsNotEmpty({ message: 'O campo DATA NASCIMENTO não pode ser vazio.' })
  @MinDate(new Date('01/01/1850'), {
    message: 'O campo DATA deve ser superior a 01/01/1850.',
  })
  @MaxDate(new Date(), {
    message: 'O campo DATA deve ser igual ou inferior à data atual.',
  })
  readonly birth: Date;

  @IsEnum(Occupation, {
    message:
      'O campo PROFISSÃO deve conter uma das opçoes: Médico, Professor ou Analista Sistemas.',
  })
  @IsNotEmpty({ message: 'O campo PROFISSÃO não pode ser vazio.' })
  @Transform((occupation) => occupation.toUpperCase())
  readonly occupation: 'MÉDICO' | 'PROFESSOR' | 'ANALISTA SISTEMAS';
}

export class ContactDto extends NewContactDto {
  readonly _id: string;
}
