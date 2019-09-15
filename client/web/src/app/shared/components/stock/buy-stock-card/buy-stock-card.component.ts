import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StockQuote } from 'src/app/core/models/stock/quote';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Account } from 'src/app/core/models/account/account';
import { PortfolioService } from 'src/app/services/portfolio/portfolio.service';
import { StockDetails } from 'src/app/core/models/stock/stockDetails';
import { Transaction } from 'src/app/core/models/transaction/transaction';
import { ClientResponse } from 'src/app/core/models/response/clientResponse';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-buy-stock-card',
  templateUrl: './buy-stock-card.component.html',
  styleUrls: ['./buy-stock-card.component.scss']
})
export class BuyStockCardComponent implements OnInit {

  isSubmitting: boolean = false;
  @Input() stockDetails: StockDetails;
  @Input() quote: StockQuote;
  @Input() account: Account;
  @Output() boughtStockEmitter: EventEmitter<boolean> = new EventEmitter();
  shareCountForm: FormGroup;
  estimatedCost: number = 0;
  errors: string[];
  done: boolean;
  isBuy: boolean = true;

  constructor(private fb: FormBuilder, private portfolioService: PortfolioService,
    private accountService: AccountService) { }

  ngOnInit() {
    this.shareCountForm = this.fb.group({
      shareCount: new FormControl(null, [Validators.required, Validators.min(1)])
    })

    this.shareCountForm.controls['shareCount'].valueChanges.subscribe((shareCount: number) => {
      this.estimatedCost = this.quote.latestPrice * shareCount;
    })
  }

  placeOrder(): void {
    this.done = false;
    this.errors = [];

    if (this.shareCountForm.invalid)
      return this.shareCountForm.markAllAsTouched();

    this.isSubmitting = true;

    let action: Promise<Transaction>;

    if (this.isBuy)
      action = this.portfolioService.buyStock(this.stockDetails._id, this.shareCountForm.value.shareCount);
    else
      action = this.portfolioService.sellStock(this.stockDetails._id, this.shareCountForm.value.shareCount);

    action.then((transaction: Transaction) => {
      this.accountService.getAccount()
        .then((account: Account) => {
          this.account = account
        })
        .catch(() => { })
        .finally(() => {
          this.shareCountForm.reset();
          this.done = true;
          this.isSubmitting = false;
          if (this.isBuy)
            this.boughtStockEmitter.emit(true);
        })
    }).catch((err: ClientResponse) => {
      this.isSubmitting = false;
      this.errors = err.messages
    })
  }
}
