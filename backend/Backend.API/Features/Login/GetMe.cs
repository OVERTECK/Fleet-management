using System.Security.Claims;
using Backend.API.EndpointsSettings;
using Backend.API.Services;
using Backend.DataAccess.Entities;

namespace Backend.API.Features.Login;

public class GetMe : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/users/me", async (GetMeHandler handler, HttpContext httpContext) =>
        {
            return await handler.Handle(httpContext);
        }).RequireAuthorization("Staff");
    }
}

sealed class GetMeHandler(UsersService usersService)
{
    public async Task<IResult> Handle(HttpContext httpContext)
    {
        var userId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return Results.Unauthorized();
        }

        try
        {
            Guid.TryParse(userId, out var userGuid);

            var user = await usersService.GetById(userGuid);

            return Results.Ok(new
            {
                user.Id,
                user.Login,
                Role = user.Role?.Title,
                RoleId = user.RoleId,
            });
        }
        catch (NullReferenceException)
        {
            return Results.NotFound("User not found");
        }
        catch (Exception ex)
        {
            return Results.InternalServerError($"Error getting user");
        }
    }
}