using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.DTO.Requests;

namespace Backend.API.Features.Login;

public class Login : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/login", async (
            SignInRequest signInRequest,
            LoginHandler handler,
            HttpResponse response) =>
        {
            return await handler.Handle(signInRequest, response);
        }).WithTags("Authentication");
    }
}

sealed class LoginHandler(
    ILogger<LoginHandler> logger,
    UsersService usersService)
{
    public async Task<IResult> Handle(
        SignInRequest signInRequest,
        HttpResponse response)
    {
        try
        {
            logger.LogInformation("Handling login request");

            var token = await usersService.Login(signInRequest);

            var user = await usersService.GetByLogin(signInRequest.Login);

            response.Cookies.Append("token", token);

            return Results.Ok(user);
        }
        catch (UnauthorizedAccessException ex)
        {
            logger.LogError(ex.Message);

            return Results.Unauthorized();
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);

            return Results.InternalServerError();
        }
    }
}