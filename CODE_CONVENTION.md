# Code convention

## Folder structure

```typescript
- client

- configs
--- ExternalModuleRegister

- modules
--- user

--- recruitment
```

## Convention
- Each module will serve for a specific topic like the user, contract, recruitment... Our mission is to create reusable, maintainable things that other modules can use it. Besides, that will also serve as our.

- Avoid inject via concrete class, use inject via token instead due to typescript cannot inject via interface. We would decide token as our interface instead of typescript interface.
```
@Injectable()
class UserCheckoutBus implement UserCheckout {}

@Module({
  providers: [
    {
      provide: 'UserCheckout',
      useClass: UserCheckoutBus // When class change, all injection will be kept as old
    }
  ]
})
```

- Constant should be written in UPPER_CASE