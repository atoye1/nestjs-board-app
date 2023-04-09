<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## 레퍼런스

https://www.youtube.com/watch?v=3JminDpCJNE&t=513s

## 프로젝트 기본 구조

.eslintrc.js : 특정한 규칙에 따라 코드를 작성할 수 있게 도와주는 가이드라인. 코드컨벤션  
.prettierrc : 따옴표나 인덴트와 같은 미시적인 포맷을 일관되게 도와주는 포맷터  
nest-cli.json  
tsconfig.json : 타입스크립트 컴파일 설정  
tsconfig.build.json : build할 때 필요한 설정들 추가. exclude에 빌드할 필요없는 파일을 명시해줄 수 있다.  
package.json : 알제?, nest가 필요한 명령어를 많이 추가해준다. prestart, poststart 등을 추가하면 편리하다.  
src/main.ts : 루트모듈인 app 모듈을 시작해준다. 엔트리포인트.

## Nest에서 Hello World를 출력하는 과정

1. main.ts 에서 AppModule을 만든다.
2. AppModule에는 Controller와 Service가 등록되어 있음
3. 요청이 오면 라우팅을 거쳐 해당 Controller가, Service에 있는 함수를 실행시킨다.
4. Service에 Hello World를 리턴하는 로직이 작성되어 있다.
5. 컨트롤러가 service를 실행시켜 response를 만들어서 돌려준다.

## Nest의 모듈이란?

우리가 만들 모듈들

1. 앱모듈
2. 보드 모듈
3. 인증 모듈

모듈은 @Module()이 달린 클래스다.
AppModule은 루트모듈로서 항상 존재해야 한다.
밀접하게 관련된 기능 집합으로 모듈을 구성해야 한다.
모듈은 기본적으로 `싱글턴`이므로 여러 모듈간에 동일한 인스턴스를 공유해준다.
(프레임워크가 싱글턴으로 관리해준다.)

## BoardModule 생성하기

빌트인 cli 명령어로 간단하게 생성할 수 있다.
`nest g mo boards` : hey nest generate module boards!

## Controller란?

컨트롤러는 @Controller 데커레이터가 적용된 클래스다.
요청을 받아 처리하고 응답을 반환한다.
@Get @Post @Delete와 같은 데커레이터로 장식된 컨트롤러 클래스의 메서드는 핸들러라 한다.
데커레이터의 인자로 라우팅 경로와 파라미터 설정 가능한다.

## Board Contoller 만들기

`nest g co boars --no-spec`
import 까지 nest가 자동으로 해준다.

## Board Service 만들기

서비스는 보통 데이터베이스 관련 로직을 처리한다.
역시 편리한 cli명령어를 활용한다.
`nest g s boards --no-spec`

서비스도 역시 클래스인데, @Injectable 데커레이터가 적용되어 있다.
이를 통해서 다른 컴포넌트에서 이 서비스를 사용할 수 있다.

서비스를 컨트롤러에서 이용하도록 의존성 주입해준다. (Dependency Injection)
보드 컨트롤러의 생성자 안에서 타입이 지정된 프라이빗 멤버로 주입된다.
간략하게 생성자 지정시 빈 바디`{ ... }`를 포함해야되는것 잊지 말자
`constructor(private myService:MyService) {}`

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

## CRUD에서 R에 해당하는 로직 구현하기

아래의 데이터 흐름을 잘 파악하기.
request -> controller -> service -> controller -> response

## Board 모델 정의하기.

엔티티가 가지고 있어야 할 속성들을 정의한 것이 모델
board.model.ts로 생성한다.
인터페이스나 클래스를 활용해서 생성한다.
정의한 모델을 타입으로 재활용하면 코드의 가독성과 안정성이 증가한다.

## 게시물 생성하기 Service 부분 추가

게시물의 id를 유니크하게 정해주기 위해서 uuid 패키지를 사용한다.

`npm install uuid`  
`npm i --save-dev @types/uuid`  
`import {v1 as uuid} from uuid`

## 게시물 생성하기 Controller 추가

포스트맨이나 curl을 활용해서 POST 리퀘스트 날리기
-H Content-Type을 제대로 지정해줘야 curl에서 바디가 제대로 전달된다.
`curl localhost:3000/boards -H "Content-Type:Application/json" -X POST -d '{"title":"board 1", "description":"description 1"}'`

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

## id를 이용해 특정 게시물을 가져오기

service와 컨트롤러 둘다 구현 필요하다.  
@Param으로 uri 파라미터를 해석한다.

모든 파라미터를 가지고 올때 : `findOne(@Param() params:string[])`
특정 파라미터를 가지고 올때 : `findOne(@Param('id') id:string)`

## ID를 이용해 특정 게시물을 삭제하고 업데이트 하기.

@Delete, @Patch 데커레이터를 컨트롤러에 사용하고
해당 컨트롤러가 호출하는 service에 관련 메서드를 정의하자.

## Pipe

파이프는 클래스인데, @Injectable() 데커레이터로 수식된 클래스다.  
뇌피셜로 `파이프는 프로바이더의 일종이다.`라고 생각했는데 둘은 유사한 측면이 있지만 다르다.
프로바이더는 다른 클래스에 주입되는 것

파이프는 핸들러가 처리하는 인수에 대해서만 작동하는데
data transformation과 validation을 수행한다.
따라서 파이프의 호출시점은 핸들러 메서드가 호출되기 직전이다.

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

### postgresSQL 과 typeORM

패키지 설치  
`npm i pg typeorm @nestjs/typeorm`
공식문서 참고  
https://docs.nestjs.com/techniques/database

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

### DB를 활용한 CRUD
