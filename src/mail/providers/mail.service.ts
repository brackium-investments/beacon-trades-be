import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';
import { ROOT_PATH } from 'src/config/paths.config';
import formatAmount from 'src/utils/formatAmount';

@Injectable()
export class MailService {
  constructor(
    /**
     * mail service
     */
    private readonly mailerService: MailerService,
  ) {}

  public async sendFoundationRecievedMail(
    name: string,
    email: string,
    amount: number,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `BlueLedge Asset Partners  <${'admininvestor@brackifi-investor.io'}>`,
      subject: `🙏 Thank you for your generous donation!`,
      template: path.join(ROOT_PATH, '/src/mail/templates/foundation.ejs'),
      context: {
        name: name,
        email: email,
        amount: formatAmount(String(amount)),
      },
    });
  }

  public async createInvestmentMail(
    name: string,
    email: string,
    amount: number,
    investmentType: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `BlueLedge Asset Partners  <${'admininvestor@brackifi-investor.io'}>`,
      subject: `🚀 Your investment is confirmed!`,
      template: path.join(ROOT_PATH, '/src/mail/templates/newInvestment.ejs'),
      context: {
        name: name,
        email: email,
        amount: formatAmount(String(amount)),
        investmentType,
      },
    });
  }

  public async contactUsMail(
    name: string,
    email: string,
    phoneNumber: string,
    message: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: 'favourejim56@gmail.com',
      from: `BlueLedge Asset Partners  <${'admininvestor@brackifi-investor.io'}>`,
      subject: `Contact us message`,
      template: path.join(ROOT_PATH, '/src/mail/templates/contact-us.ejs'),
      context: {
        userName: name,
        userEmail: email,
        phoneNumber,
        message,
        email: 'favourejim56@gmail.com',
      },
    });
  }

  public async activateInvestmentMail(
    name: string,
    email: string,
    amount: number,
    investmentType: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `BlueLedge Asset Partners  <${'admininvestor@brackifi-investor.io'}>`,
      subject: `🚀 Your investment is activated!`,
      template: path.join(
        ROOT_PATH,
        '/src/mail/templates/activate-investment.ejs',
      ),
      context: {
        name: name,
        email: email,
        amount: formatAmount(String(amount)),
        investmentType,
      },
    });
  }

  public async welcomeMail(name: string, email: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `BlueLedge Asset Partners  <${'admininvestor@brackifi-investor.io'}>`,
      subject: `🎉 Welcome to BlueLedge Asset Partners!`,
      template: path.join(ROOT_PATH, '/src/mail/templates/welcome.ejs'),
      context: {
        name: name,
        email: email,
      },
    });
  }

  public async subscriberMail(email: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `BlueLedge Asset Partners  <${'admininvestor@brackifi-investor.io'}>`,
      subject: `🎉 You just subscribed to our newsletter!`,
      template: path.join(ROOT_PATH, '/src/mail/templates/subscriber.ejs'),
      context: {
        email: email,
      },
    });
  }

  public async applyForLoanMail(
    name: string,
    email: string,
    amount: number,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `BlueLedge Asset Partners  <${'admininvestor@brackifi-investor.io'}>`,
      subject: `🚀 Your loan request is confirmed!`,
      template: path.join(ROOT_PATH, '/src/mail/templates/loan.ejs'),
      context: {
        name: name,
        email: email,
        amount: formatAmount(String(amount)),
      },
    });
  }
}
