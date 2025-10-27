using Backend.API.EndpointsSettings;

namespace Backend.API.Features.Cars;

public class CreateEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/cars", async (CreateHandler handler) =>
        {
            await handler.Handle();
        });
    }
}

public sealed class CreateHandler
{
    private readonly ILogger<CreateHandler> _logger;

    public CreateHandler(ILogger<CreateHandler> logger)
    {
        _logger = logger;
    }

    public async Task Handle()
    {
        _logger.LogInformation("Creating car");

        await Task.Delay(5000);
    }
}