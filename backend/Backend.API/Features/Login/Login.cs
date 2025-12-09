using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.DTO.Requests;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Components.Forms;

namespace Backend.API.Features.Login;

public class Login : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/login", async (
            SignInRequest signInRequest,
            LoginHandler handler,
            HttpContext httpContext,
            IAntiforgery antiforgery) =>
        {
            return await handler.Handle(signInRequest, httpContext, antiforgery);
        }).WithTags("Authentication");
    }
}

sealed class LoginHandler(
    ILogger<LoginHandler> logger,
    UsersService usersService)
{
    public async Task<IResult> Handle(
        SignInRequest signInRequest,
        HttpContext httpContext,
        IAntiforgery antiforgery)
    {
        try
        {
            logger.LogInformation("Handling login request");

            var token = await usersService.Login(signInRequest);

            httpContext.Response.Cookies.Append("token", token);

            var antiToken = antiforgery.GetAndStoreTokens(httpContext);

            var user = await usersService.GetByLogin(signInRequest.Login);

            return Results.Ok(new
            {
                id = user.Id,
                csrfToken = antiToken.RequestToken,
                login = user.Login,
                role = user.Role,
                roleId = user.RoleId,
            });
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