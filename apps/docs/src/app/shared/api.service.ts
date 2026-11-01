import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { computed } from '@angular/core';
import { shareReplay } from 'rxjs';
import { ApiData, ApiSymbol } from './api.model';

/** Loads the generated API reference and indexes it by symbol name. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  readonly data$ = this.http.get<ApiData>('generated/api.json').pipe(shareReplay(1));
  readonly data = toSignal(this.data$);

  /** All symbols by name. Names are unique across the three packages. */
  readonly byName = computed(() => {
    const map = new Map<string, ApiSymbol>();
    for (const pkg of this.data()?.packages ?? []) for (const s of pkg.symbols) map.set(s.name, s);
    return map;
  });

  link(symbol: ApiSymbol): string {
    return `/api/${symbol.package}/${symbol.slug}`;
  }
}
