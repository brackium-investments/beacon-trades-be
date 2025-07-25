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
      subject: `🌟 Thank You For Your Generous Donation Made!`,
      template: path.join(ROOT_PATH, '/src/mail/templates/foundation.ejs'),
      context: {
        name: name,
        email: email,
        amount: formatAmount(String(amount)),
      },
    });
  }

  public async confirmDonationMail(
    name: string,
    email: string,
    amount: number,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `BlueLedge Asset Partners  <${'admininvestor@brackifi-investor.io'}>`,
      subject: `🌟 Donation Confirmed: Thank You For Your Generous Donation Made!`,
      template: path.join(
        ROOT_PATH,
        '/src/mail/templates/confirm-donation.ejs',
      ),
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
      subject: `💰 Investment created!`,
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
      subject: `📬 New Contact Message Received`,
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

  public async forgotPasswordMail(
    name: string,
    email: string,
    otp: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `BlueLedge Asset Partners  <${'admininvestor@brackifi-investor.io'}>`,
      subject: `🔒 Password Reset Request`,
      template: path.join(ROOT_PATH, '/src/mail/templates/forgot-password.ejs'),
      context: {
        name,
        email,
        otp,
      },
    });
  }

  public async resetPasswordMail(name: string, email: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `BlueLedge Asset Partners  <${'admininvestor@brackifi-investor.io'}>`,
      subject: `✅ Password Reset Successfully`,
      template: path.join(ROOT_PATH, '/src/mail/templates/reset-password.ejs'),
      context: {
        name,
        email,
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
      subject: `📈 Your Investment is Now Active!`,
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

  public async activateLoanMail(
    name: string,
    email: string,
    amount: number,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `BlueLedge Asset Partners  <${'admininvestor@brackifi-investor.io'}>`,
      subject: `📈 Your loan is Now Active!`,
      template: path.join(ROOT_PATH, '/src/mail/templates/activate-loan.ejs'),
      context: {
        name: name,
        email: email,
        amount: formatAmount(String(amount)),
      },
    });
  }

  public async activateUserMail(name: string, email: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `BlueLedge Asset Partners  <${'admininvestor@brackifi-investor.io'}>`,
      subject: `🎊 Account Activated!`,
      template: path.join(ROOT_PATH, '/src/mail/templates/activate-user.ejs'),
      context: {
        name: name,
        email: email,
      },
    });
  }

  public async welcomeMail(name: string, email: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: `BlueLedge Asset Partners  <${'admininvestor@brackifi-investor.io'}>`,
      subject: `👋 Welcome to BlueLedge Asset Partners!`,
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
      subject: `📰 Subscribed to Our Newsletter!`,
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
      subject: `💸 Loan Request Confirmed`,
      template: path.join(ROOT_PATH, '/src/mail/templates/loan.ejs'),
      context: {
        name: name,
        email: email,
        amount: formatAmount(String(amount)),
      },
    });
  }
}
