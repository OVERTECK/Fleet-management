namespace Backend.API.EndpointsSettings;

public interface IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app);
}