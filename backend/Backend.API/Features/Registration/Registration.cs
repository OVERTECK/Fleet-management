using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.DTO.Requests;
using Microsoft.EntityFrameworkCore;

namespace Backend.API.Features.Registration;

public class Registration : IEndpoint
{
     public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/registration", async (
            SignUpRequest signUpRequest,
            RegistrationHandler handler,
            HttpResponse response) =>
        {
            return await handler.Handle(signUpRequest, response);
        }).WithTags("Authentication");
    }
}

sealed class RegistrationHandler(
    ILogger<RegistrationHandler> logger,
    UsersService usersService)
{
    public async Task<IResult> Handle(
        SignUpRequest signUpRequest,
        HttpResponse response)
    {
        try
        {
            logger.LogInformation("Handling registration request");

            var token = await usersService.SignUp(signUpRequest);

            var user = await usersService.GetByLogin(signUpRequest.Login);

            response.Cookies.Append("token", token);

            return Results.Ok(user);
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