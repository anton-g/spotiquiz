import { Controller, Get, Post, Param, HttpCode, Body } from "@nestjs/common";
import { GameService } from "./game.service";
import { Game } from "./interfaces/game.interface";
import { JoinGameDto } from "./dtos/join-game.dto";
import { GameDto } from "./dtos/game.dto";

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @HttpCode(201)
    @Post()
    async create (): Promise<GameDto> {
        const game: Game = await this.gameService.create()
        return new GameDto(game)
    }

    @HttpCode(200)
    @Post(':key/join')
    async join (@Body() joinGameDto: JoinGameDto, @Param() params): Promise<GameDto> {
      const game = await this.gameService.join(params.key, joinGameDto)
      return new GameDto(game)
    }

    @HttpCode(200)
    @Get(':key')
    async get (@Param() params): Promise<GameDto> {
      const game = await this.gameService.get(params.key)
      return new GameDto(game)
    }

    @HttpCode(200)
    @Get(':key/exists')
    async exist (@Param() params): Promise<boolean> {
        const game = await this.gameService.get(params.key)
        return !!(game)
    }
}