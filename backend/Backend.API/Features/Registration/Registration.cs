using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.DTO.Requests;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Features.Registration;

public class Registration : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/registration", async (
            SignUpRequest signUpRequest,
            RegistrationHandler handler,
            HttpContext httpContext,
            IAntiforgery antiforgery) =>
        {
            return await handler.Handle(signUpRequest, httpContext, antiforgery);
        }).WithTags("Authentication");
    }
}

sealed class RegistrationHandler(
    ILogger<RegistrationHandler> logger,
    UsersService usersService)
{
    public async Task<IResult> Handle(
        SignUpRequest signUpRequest,
        HttpContext httpContext,
        IAntiforgery antiforgery)
    {
        try
        {
            logger.LogInformation("Handling registration request");

            var token = await usersService.SignUp(signUpRequest);

            httpContext.Response.Cookies.Append("token", token);

            var antiToken = antiforgery.GetAndStoreTokens(httpContext);

            var user = await usersService.GetByLogin(signUpRequest.Login);

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
        catch (ArgumentException ex)
        {
            logger.LogError(ex.Message);

            return Results.BadRequest(ex.Message);
        }
        catch (DbUpdateException ex)
        {
            logger.LogError(ex.Message);

            return Results.BadRequest("Error. Attempt to write a non-existent foreign key.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex.Message);

            return Results.InternalServerError();
        }
    }
}