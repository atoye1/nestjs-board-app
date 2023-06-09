<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## 레퍼런스

https://www.youtube.com/watch?v=3JminDpCJNE&t=513s

## Nest.js 기본구조

### 설정파일

.eslintrc.js : 특정한 규칙에 따라 코드를 작성할 수 있게 도와주는 가이드라인. 코드컨벤션  
.prettierrc : 따옴표나 인덴트와 같은 미시적인 포맷을 일관되게 도와주는 포맷터  
nest-cli.json  
tsconfig.json : 타입스크립트 컴파일 설정  
tsconfig.build.json : build할 때 필요한 설정들 추가. exclude에 빌드할 필요없는 파일을 명시해줄 수 있다.  
package.json : 알제?, nest가 필요한 명령어를 많이 추가해준다. prestart, poststart 등을 추가하면 편리하다.  
src/main.ts : 루트모듈인 app 모듈을 시작해준다. 엔트리포인트.

### 기본 동작 원리

Hello World를 출력하는 과정

1. main.ts 에서 AppModule을 만든다.
2. AppModule에는 Controller와 Service가 등록되어 있음
3. 요청이 오면 라우팅을 거쳐 해당 Controller가, Service에 있는 함수를 실행시킨다.
4. Service에 Hello World를 리턴하는 로직이 작성되어 있다.
5. 컨트롤러가 service를 실행시켜 response를 만들어서 돌려준다.

## 모듈이란?

우리가 만들 모듈들

1. 앱모듈
2. 보드 모듈
3. 인증 모듈

모듈은 @Module()이 달린 클래스다.
AppModule은 루트모듈로서 항상 존재해야 한다.
밀접하게 관련된 기능 집합으로 모듈을 구성해야 한다.
모듈은 기본적으로 `싱글턴`이므로 여러 모듈간에 동일한 인스턴스를 공유해준다.
(프레임워크가 싱글턴으로 관리해준다.)

### BoardModule 생성하기

빌트인 cli 명령어로 간단하게 생성할 수 있다.
`nest g mo boards` : hey nest generate module boards!

## Controller란?

컨트롤러는 @Controller 데커레이터가 적용된 클래스다.
요청을 받아 처리하고 응답을 반환한다.
@Get @Post @Delete와 같은 데커레이터로 장식된 컨트롤러 클래스의 메서드는 핸들러라 한다.
데커레이터의 인자로 라우팅 경로와 파라미터 설정 가능한다.

### Board Contoller 만들기

`nest g co boars --no-spec`
import 까지 nest가 자동으로 해준다.

## Provider란?

(종속성)프로바이더는 Nest의 기본 개념입니다.
서비스, 리포지토리, 팩토리, 헬퍼 등 네스트의 기본 서비스는 모두 프로바이더로 취급될 수 있다.
객체는 다양한 관계를 맺을 수 있는데, 객체인스턴스를 직접 연결하는 기능은 Nest런타임이 담당한다.
프로바이더는 `등록`해야 사용할 수 있다. 등록은 module파일에 provider 항목에다 배열의 원소형태로 등록한다.

## Service란?

NestJS에서만 쓰이는 개념이 아니라 소프트웨어 개발에서 널리 쓰이는 공통개념이다.
Service는 @Injectable로 랩핑된 클래스다. 따라서 어플리케이션 전체에서 주입해서 활용가능하다.
Service는 데이터 유효성체크나 DB와 통신하는 작업을 주로 수행한다.
Controller 생성자에 속성으로 Inject해서 사용한다.

### Board Service 만들기

서비스는 보통 데이터베이스 관련 로직을 처리한다.
역시 편리한 cli명령어를 활용한다.
`nest g s boards --no-spec`

서비스도 역시 클래스인데, @Injectable 데커레이터가 적용되어 있다.
이를 통해서 다른 컴포넌트에서 이 서비스를 사용할 수 있다.

서비스를 컨트롤러에서 이용하도록 의존성 주입해준다. (Dependency Injection)
보드 컨트롤러의 생성자 안에서 타입이 지정된 프라이빗 멤버로 주입된다.
간략하게 생성자 지정시 빈 바디`{ ... }`를 포함해야되는것 잊지 말자
`constructor(private myService:MyService) {}`

## CRUD에서 R에 해당하는 로직 구현하기

아래의 데이터 흐름을 잘 파악하기.
request -> controller -> service -> controller -> response

### Board 모델 정의하기.

엔티티가 가지고 있어야 할 속성들을 정의한 것이 모델
board.model.ts로 생성한다.
인터페이스나 클래스를 활용해서 생성한다.
정의한 모델을 타입으로 재활용하면 코드의 가독성과 안정성이 증가한다.

### 게시물 생성하기 Service 부분 추가

게시물의 id를 유니크하게 정해주기 위해서 uuid 패키지를 사용한다.

`npm install uuid`  
`npm i --save-dev @types/uuid`  
`import {v1 as uuid} from uuid`

### 게시물 생성하기 Controller 추가

포스트맨이나 curl을 활용해서 POST 리퀘스트 날리기
-H Content-Type을 제대로 지정해줘야 curl에서 바디가 제대로 전달된다.
`curl localhost:3000/boards -H "Content-Type:Application/json" -X POST -d '{"title":"board 1", "description":"description 1"}'`

### id를 이용해 특정 게시물을 가져오기

service와 컨트롤러 둘다 구현 필요하다.  
@Param으로 uri 파라미터를 해석한다.

모든 파라미터를 가지고 올때 : `findOne(@Param() params:string[])`
특정 파라미터를 가지고 올때 : `findOne(@Param('id') id:string)`

### ID를 이용해 특정 게시물을 삭제하고 업데이트 하기.

@Delete, @Patch 데커레이터를 컨트롤러에 사용하고
해당 컨트롤러가 호출하는 service에 관련 메서드를 정의하자.

## Data Transfer Object

계층간 데이터 교환을 위한 객체
DB에서 데이터를 얻어서 서비스나 컨트롤러로 보낼때 사용되는 객체
데이터가 네트워크를 통해 전송되는 방법을 정의하는 객체
인터페이스나 클래스를 통해서 정의될 수 있음( 공식문서에는 class 사용을 권장함)
클래스는 런타임에서 작동하므로 파이프같은 기능을 활용할 때 더 유용한다.
(네스트런타임이 인스턴스화시켜서 이미 런타임시 메모리에 갖고 있는듯.)

DTO를 사용하면 데이터 유효성을 효율적으로 검사할 수 있고
코드를 안정적으로 작성할 수 있다.
전달하는 정보가 한두개로 작다면 하드코딩해도 무방하지만
실무에서는 수십개의 정보를 전달해야되므로 클래스로 정의해서 추상화된 DTO객체에 의존하도록 해야
확장에는 열려있고 변경에는 닫혀있는 구조가 된다.(DTO 변경시 해당 클래스와 관련된 로직만 변경하고 호출 부분은 변경하지 않아도 되기 때문이다.)
그래야 유지보수가 편하고, 칼퇴가 가능하다.

## Pipe

### 파이프란?

파이프는 클래스인데, @Injectable() 데커레이터로 수식된 클래스다.  
뇌피셜로 `파이프는 프로바이더의 일종이다.`라고 생각했는데 둘은 유사한 측면이 있지만 다르다.
프로바이더는 다른 클래스에 주입되는 것

파이프는 핸들러가 처리하는 인수에 대해서만 작동하는데
data transformation과 validation을 수행한다.
따라서 파이프의 호출시점은 핸들러 메서드가 호출되기 직전이다.

### 파이프의 종류

파이프의 사용은 3가지 레벨에서 가능하다.

1. 핸들러 레벨 파이프  
   핸들러의 모든파라미터에 적용된다.  
    @UsePipes() 데커레이터를 사용한다.

   ```typescript
   @Post()
   @UsePipes(pipe)
   createBoard(
     @Body('title').title,
     @Body('description').description
   ){}
   ```

2. 파라미터 레벨 파이프  
   title이라는 파라미터 하나에만 작동하도록 작성한 것.

   ```typescript
   @Post()
   createBoard(
     @Body('title', ParameterPipe).title,
     @Body('description').description
   ){}
   ```

3. 글로벌 레벨 파이프  
   클라이언트에 들어오는 모든 요청에 대해서 적용된다.  
   따라서 main.ts에 정의해야 한다.
   ```typescript
   async function bootstrap() {
     const app = await NestFactory.create(AppModule);
     app.useGlobalPipes(GlobalPipes);
     await app.listen(3000);
   }
   bootstrap();
   ```

### 파이프를 이용한 유효성 체크

밸리데이션과 트랜스포메이션을 위한 패키지 설치  
`npm i class-validator class-transformer`

아래와 같이 dto에 데커레이터를 적용하면 손쉽게 유효성 체크 가능
라고 생각했으나 나의 착각!!
dto에 적용된 데커레이터를 활성화시키려면 handler레벨에서 파이프를 사용하도록 설정해줘야 한다.

```typescript
import { IsNotEmpty } from 'class-validator';
export class createBoardDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
```

따라서 아래와 핸들러에 추가로 설정해줘야 dto에 설정한 validation이 제대로 작동한다.

```typescript
  @Post('/')
  @UsePipes(ValidationPipe)
  createBoard(@Body() createBoardDto: createBoardDto): Board {
    return this.boardsService.createBoard(createBoardDto);
  }
```

### 커스텀 파이프 구현

먼저 PipeTransfrom이란 인터페이스를 새로운 커스텀 파이프에 구현해줘야 한다.
해당 인터페이스에 있는 transfrom()메서드를 커스텀파이프 클래스에서 정의해줘야 한다.
transfrom 메서드의 파라미터는 value, metadata이다.

커스텀 파이프를 구현해서 value, metadata를 콘솔로 찍어보자.

BoardStatusValidationPipe를 enum에서 정의된 PUBLIC | PRIVATE 이외의 값이 들어올때 에러를 던지도록 구현해야 한다.  
필요한 자료구조를 정의하고, 조건에 부합하면 value를 반환하고, 아니면 BadRequestException을 던지면 된다.

## postgresSQL 과 typeORM

패키지 설치  
`npm i pg typeorm @nestjs/typeorm`
공식문서 참고  
https://docs.nestjs.com/techniques/database

### postgresSQL

도커를 사용해서 간단하게 구동,
dbBeaver 활용

### typeorm 설정

typeorm.config.ts 설정

### entity 생성하기

ORM이므로 클래스를 생성한 후 그 안에 컬럼들을 정의한다.

### Repository 생성하기

기존의 Controller Service 구조에 Repository가 추가되었다.  
DB관련된 작업은 Service가 아닌 Repository에서 수행한다.  
아래와 같은 흐름  
Controller -> Service -> Repository -> DB -> Service -> Controller

@EntityRepository()
클래스를 사용자 정의 저장소로 선언하는데 사용됩니다.
일부 특정 엔터티를 관리하거나 일반 저장소 일 수 있습니다.
typeorm0.3 이후로는 deprecated.

## DB를 활용한 CRUD

Repository를 Service에 Inject해줘야 된다.
@InjectRepository 매개변수 데커레이터를 사용해야된다.

### TypeORM 0.3 버전

@EntityRepository() 가 deprecated되었다.
대신 Entity를 바로 @InjectRepository 할 수 있다.
굳이 board.repository.ts 를 별도로 할 필요없이 entitiy를 respository로 추상화해서 service단에서 호출 가능하다.
이게 가능한 이유는 repository로 추상화되면 DB를 조작하는 create, find, findOne 등의 ORM에서 지원하는 메서드가 동일하기 때문이다.
이전처럼 분리해서 Service의 생성자에 프라이빗 멤버로 주입해서 사용도 가능하지만 이번 게시판 프로젝트와 같이 DB에 간단한 CRUD만 수행할때는
한번에 처리하는게 간편하다고 생각하므로(어차피 코드 한줄 또는 두줄이므로) service와 respository를 합쳤다.

### Remove vs Delete

Remove는 무조건 존재하는 아이템을 지워야 한다.
Delete는 존재하면 지우고, 존재하지 않으면 그대로 놔둔다.

@Params안에서 ParseIntPipe 활용하기

```typescript
@Delete('/:id')
deleteBoard(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.boardsService.deleteBoardById(id);
}
```

### 기타 CRUD 오퍼레이션

단순히 DB에서 값을 조회하고, 업데이트하고, 변경하는 로직들.

## 인증기능 구현을 위한 준비

`nest g module auth`
`nest g co auth --no-spec`
`nest g service auth --no-spec`

### User를 위한 Entity 생성

### Class Validator를 활용한 입력값 검사하기

dto에 validation조건을 정의해놓고, 컨트롤러에 `@Body(ValidationPipe)`를 추가해서 트리거한다

### user이름을 유니크하게 만들기

DB(엔터티) 레벨에서 구현하는 것
만약에 500 에러말고 구체적 에러를 던지려면 try/catch 지정해줘야 한다.

### bcrypt로 패스워드 암호화해서 DB에 저장하기.

### 로그인 기능 구현하기

컨트롤러로 들어온 아이디와 패스워드를 DB에 저장된 내역과 비교한다.
`bcrypt.compare(password, db.password)`가 true이면 로그인이 성공한다.

### JWT를 활용한 로그인

정보를 안정적으로 저장하기 위한 토큰
header, payload, signature로 구성되어 있음
header는 메타데이터를 포함: 타입, 해싱 알고리즘 등
payload에 있는 내용은 평문이다.
signature : 서버의 개인키로 서명된 서명. 따라서 클라이언트는 정당한 서버에서 온 토큰인지 검증 가능함.

필요한 모듈 설치
`npm i @nestjs/jwt @nestjs/passport passport passport-jwt`

```typescript
// 아래와 같이 모듈을 등록한다.
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassPortModule.register({defaultStrategy:'jwt}),
    JwtModule.register({
      secret: 'Secret1234',
      signOptions: {
        expiresIn: 60 * 60,
      },
    }),
  ]
})
```

jwt를 사용할 auth 서비스의 생성자에 JwtService를 주입한다.

### passport활용해서 jwt토큰을 받아 사용자 인증한다.

1. 클라이언트가 로그인한다.
2. 로그인 정보가 맞으면 토큰을 발급한다.
3. 유저는 토큰을 쿠키에 저장한다.
4. 유저는 요청을 보낼때마다 쿠키에 저장된 jwt토큰을 같이 송신한다.
5. 서버는 jwt토큰을 검증해서 로그인정보를 판별한다.

`npm i -D @types/passport-jwt` 타입을 설치한다.

### passport 전략에서 validate에서 return 해주는 user객체 정보를 request객체에 삽입

`@UseGuard(AuthGuard())`를 사용한다.

## 미들웨어

Pipes, Filters, Guards, Intercepters 네가지 종류 미들웨어가 있다.

## 미들웨어가 호출되는 순서(!!중요)

1. middleware
2. guard
3. pre-intercepter
4. pipe
5. controller
6. service
7. controller
8. post-interceptor
9. filter
10. client

### 커스템 데커레이터

req.user가 아니라 user로 바로 유저정보를 가져올 수 있게하기 위한 커스텀 데커레이터
nestjs에 포함되어 있는 createParamDecorator를 활용해서
execution context안에 있는 req객체에서 user정보만 추출하는 방식이다.

```typescript
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from './user.entitiy';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
```

### 다른 모듈에서 정의된 Guard()미들웨어 사용하기

게시글에 대해 CRUD에 컨트롤러 레벨로 @UserGuard(AuthGuard()) 적용하면  
해당 컨트롤러의 전체 기능을 로그인 사용자만 접근가능하다.
auth 모듈을 임포트하고 데커레이터로 적용만 해주면 해당 미들웨어의 적용 범위를 손쉽게 수정가능하다.
객체지향의 핵심은 역시 확장, 유지보수가 쉬운 코드를 작성하는 것이란말인가....
내가 작성했던 express 서버는 수정사항이 발생할때마다 작업량이 많았는데....
이래서 프레임워크, 객체지향, 디자인패턴을 사용 안 할 수가 없다..

> 너무 간단하고 좋은거 아냐? 이 좋은걸 나만 모르고 있었단 말이가? 😠😠 이제 알았다는 점에선 기쁘지만... Express에서 했던 무수한 삽질을 생각하면 깊은 빡침이...

## 유저와 게시물의 관계 형성 해주기

엔티티에 서로간의 관계 형성해주기!!
서로 참조하면서 아래와 같은 데커레이터로 지정해주면 된다.

```typescript
@ManyToOne((type) => User, (user) => user.boards, { eager: false })
user: User;
```

### 자신이 생성한 게시글만 지울수 있게하기

typeorm 버전이 바뀌어서 쿼리를 이렇게 nested object 형식으로 해줘야된다.
`const result = await this.boardRepository.delete({ id, user: { id: user.id }, }); `

## 로그만들기

원래는 기능 하나하나 추가하면서 거기에 맞는 로그출력을 해줘야한다.
하지만 배우는 입장에서 섞이면 혼란스러우니 뒷장에서 배운다.

보통 winston을 많이 사용하는데 일단 여기선 nestjs에 빌트인 로거를 사용한다.
Logger.log(<message>)
컨트롤러 안에 멤버로 새로운 로거객체를 생성한다.
어디서 로그가 호출되는지 간단하게 파악 가능하다.

```typescript
// 컨트롤러 클래스 안에다 넣어준다.
private logger = new Logger('Board Controller');
this.logger.verbose(`User ${user.username} trying to get all boards`);
// 변수를 로그로 출력하려면 JSON.stringify해줘야 내용이 제대로 출력된다.
//아니면 [Object...] 이런 형식으로 출력된다.
this.logger.verbose( `User ${user.username} is creating board with Payload:${JSON.stringify( createBoardDto,)}`,);
```

## 설정파일 만들기

### Codebase vs Environment Variable(환경변수)

port, dbtype, dbport, jwt expires in 등을 default에 넣는다.

npm i config

프로젝트 루트 디렉터리에 config라는 폴더를 만들고 아래와 같은 yml을 생성한다.
default.yml : 개발과 배포환경 동일한 환경변수
development.yml, production.yml : 개발과 배포시 다른 환경변수

참고로 synchronize true는 시작할때 entitiy 변경이 있으면 컬럼을 다시 생성해준다.
프로덕션에서는 당연히 false를 해줘야 된다.
